// tests/integration.test.js
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const execAsync = promisify(exec);

describe('Container Integration Tests', () => {
    describe('FFmpeg', () => {
        test('ffmpeg is installed and can create test video', async () => {
            return new Promise((resolve, reject) => {
                ffmpeg()
                    .input('testsrc=duration=1:size=1280x720:rate=30')
                    .inputFormat('lavfi')
                    .output('test-output.mp4')
                    .on('end', async () => {
                        try {
                            const stats = await fs.stat('test-output.mp4');
                            expect(stats.size).toBeGreaterThan(0);
                            await fs.unlink('test-output.mp4');
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    })
                    .on('error', reject)
                    .run();
            });
        }, 30000);

        test('ffmpeg can extract video metadata', async () => {
            return new Promise((resolve, reject) => {
                ffmpeg.getAvailableFormats((err, formats) => {
                    if (err) reject(err);
                    expect(formats).toBeTruthy();
                    expect(Object.keys(formats).length).toBeGreaterThan(0);
                    resolve();
                });
            });
        });
    });

    describe('Puppeteer', () => {
        let browser;
        let page;

        beforeAll(async () => {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        });

        afterAll(async () => {
            await browser.close();
        });

        beforeEach(async () => {
            page = await browser.newPage();
        });

        afterEach(async () => {
            await page.close();
        });

        test('can take screenshots', async () => {
            await page.setContent('<h1>Hello World</h1>');
            await page.screenshot({ path: 'test-screenshot.png' });

            const stats = await fs.stat('test-screenshot.png');
            expect(stats.size).toBeGreaterThan(0);

            // Clean up
            await fs.unlink('test-screenshot.png');
        });

        test('can execute JavaScript', async () => {
            await page.setContent('<div id="test">Test Content</div>');
            const content = await page.evaluate(() => {
                return document.getElementById('test').textContent;
            });
            expect(content).toBe('Test Content');
        });

        test('can record video', async () => {
            const recordingPath = 'test-recording';
            await fs.mkdir(recordingPath, { recursive: true });

            await page.setViewport({ width: 1280, height: 720 });

            const recording = await page.screencast({
                path: path.join(recordingPath, 'recording.webm'),
                frameRate: 30,
            });

            // Do something to record
            await page.setContent('<h1>Video Test</h1>');
            await page.evaluate(() => {
                document.querySelector('h1').style.color = 'red';
            });
            await new Promise(resolve => setTimeout(resolve, 1000));

            await recording.stop();

            // Check if recording exists
            const stats = await fs.stat(path.join(recordingPath, 'recording.webm'));
            expect(stats.size).toBeGreaterThan(0);

            // Clean up
            await fs.rm(recordingPath, { recursive: true });
        });
    });
});
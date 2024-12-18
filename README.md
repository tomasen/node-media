# node-media

A Docker base image extending Node.js with FFmpeg and Puppeteer for media processing and browser automation. Perfect for applications requiring video processing, screen capture, or browser-based media operations.

[![Docker Image CI](https://github.com/tomasen/node-media/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/tomasen/node-media/actions/workflows/docker-publish.yml)

## Features

- Based on `node:20-slim`
- Pre-installed FFmpeg for media processing
- Chromium and Puppeteer for browser automation
- Automatically updated weekly
- Minimal image size with optimized layers
- GitHub Container Registry distribution

## Usage

```bash
# Pull the image
docker pull ghcr.io/yourusername/node-media:latest

# Run interactively
docker run -it --rm ghcr.io/yourusername/node-media bash

# Use as base image
FROM ghcr.io/yourusername/node-media:latest
```

### Example Dockerfile using this as base

```dockerfile
FROM ghcr.io/yourusername/node-media:latest

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
```

## Installed Components

- Node.js 20
- FFmpeg (latest from Debian repositories)
- Chromium browser
- Puppeteer
- Essential fonts and media codecs
- Audio processing libraries

## Environment Variables

The following environment variables are pre-configured:

```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

## Update Policy

- Base image is checked for updates weekly
- Automated builds occur when:
  - Base Node.js image is updated
  - New versions are tagged
  - Changes are pushed to main branch

## Development

To build locally:

```bash
git clone https://github.com/yourusername/node-media.git
cd node-media
docker build -t node-media .
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Support

- Create an issue for bug reports or feature requests
- Star the repository if you find it useful
- Pull requests are welcome

## Security

Updates for security vulnerabilities are automatically incorporated through:
- Weekly base image updates
- Dependabot alerts
- GitHub security advisories

Report security vulnerabilities via GitHub's security advisory feature.
FROM node:14-slim

ENV GO_URL https://golang.org/dl/go1.14.2.linux-amd64.tar.gz

# fonts
RUN echo "deb http://httpredir.debian.org/debian buster main contrib non-free" > /etc/apt/sources.list \
    && echo "deb http://httpredir.debian.org/debian buster-updates main contrib non-free" >> /etc/apt/sources.list \
    && echo "deb http://security.debian.org/ buster/updates main contrib non-free" >> /etc/apt/sources.list \
    && echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
    && apt-get update \
    && apt-get install -y \
        fonts-arphic-ukai \
        fonts-arphic-uming \
        fonts-ipafont-mincho \
        fonts-thai-tlwg \
        fonts-kacst \
        fonts-ipafont-gothic \
        fonts-unfonts-core \
        ttf-wqy-zenhei \
        ttf-mscorefonts-installer \
        fonts-freefont-ttf \
    && apt-get clean \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Install Go for Mitm sockets
RUN set -eux; \
	wget -O go.tgz "${GO_URL}" -q --progress=bar; \
	tar -C /usr/local -xzf go.tgz; \
	rm go.tgz; \
	export PATH="/usr/local/go/bin:$PATH"; \
	go version

ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH

RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"

WORKDIR /app/agent

# NOTE: You must run yarn build:docker from root for this to work
COPY ./build-dist /app/agent/

RUN cat /etc/*-release

# Add user so we don't need --no-sandbox.
# same layer as yarn install to keep re-chowned files from using up several hundred MBs more space

# NOTE: this installs the monorepo, but you could also install agent directly + and desired browsers
# we will automatically install dependencies
RUN cd /app/agent && yarn \
    && $(npx install-browser-deps) \
    && groupadd -r agent && useradd -r -g agent -G audio,video agent \
    && mkdir -p /home/agent/Downloads \
    && mkdir -p /home/agent/.cache \
    && chown -R agent:agent /home/agent \
    && chown -R agent:agent /app/agent \
    && mv ~/.cache/agent /home/agent/.cache/ \
    && chmod 777 /tmp \
    && chmod -R 777 /home/agent/.cache/agent

# Add below to run as unprivileged user.
USER agent

CMD node core/start;
# To run this docker, please see /tools/docker/run-agent.sh

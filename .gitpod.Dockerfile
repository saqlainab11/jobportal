FROM gitpod/workspace-full

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
# RUN brew install bastet
#
# More information: https://www.gitpod.io/docs/config-docker/

FROM gitpod/workspace-full
USER gitpod
RUN curl https://cli-assets.heroku.com/install.sh | sh
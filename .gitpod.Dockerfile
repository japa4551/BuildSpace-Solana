FROM gitpod/workspace-full

RUN sh -c "$(curl -sSfL https://release.solana.com/v1.7.8/install)"
RUN export PATH=~/.local/share/solana/install/active_release/bin:$PATH

RUN sudo apt-get update
RUN sudo apt-get install -y --no-install-recommends pkg-config build-essential libudev-dev
RUN cargo install --git https://github.com/project-serum/anchor --tag v0.18.2 anchor-cli --locked

# Set up your development environment

This folder contains useful scripts and configuration so you can:

- Configure data sources in Grafana for development.
- Configure dashboards for development and test scenarios.
- Set up an SMTP Server + Web Interface for viewing and testing emails.
- Create docker-compose file with databases and fake data.

## Install Docker

Grafana uses [Docker](https://docker.com) to make the task of setting up databases a little easier. If you do not have it already, make sure you [install Docker](https://docs.docker.com/docker-for-mac/install/) before proceeding to the next step.

## Developer dashboards and data sources

To set up developer dashboards and data sources, run the following command:

```bash
./setup.sh
```

To remove the setup developer dashboards and data sources, run:

```bash
./setup.sh undev
```

After restarting the Grafana server, there should be a number of data sources named `gdev-<TYPE>` provisioned as well as a dashboard folder named `gdev dashboards`.
This folder contains dashboard and panel features tests dashboards.

Update these dashboards or make new ones as you develop new panels and dashboards features or if new bugs are found.
You can find the dashboards in the [`dev-dashboards`](./dev-dashboards) directory.

## Docker Compose with databases

The `make devenv` command creates a Docker Compose file with specified databases configured and ready to run.
Each database has a prepared image with some fake data ready to use.
For available databases, see the [`docker/blocks`](./docker/blocks) directory.

Note that for some databases there are multiple images with different versions.
Some blocks such as `slow_proxy_mac` or `apache_proxy_mac` are specifically for Macs.

To generate a development environment with InfluxDB, Prometheus, and Elastic databases,
run the following command from the root of the repository:

```bash
make devenv sources=influxdb,prometheus,elastic5
```

Some of the blocks support overriding the image version used in the Docker Compose file.
To override a block's image, provide a `<BLOCK>_version=<VERSION>` argument to `make devenv`.
- _`BLOCK`_ is the name of the block provided in the `sources` list.
- _`VERSION`_ is the version of that image you want to use.

The following example runs the `postgres` block at version `9.2`, the `grafana` block at version `6.7.0-beta1`, and the `auth/openldap` block at the default version:

```bash
make devenv sources=postgres,auth/openldap,grafana postgres_version=9.2 grafana_version=6.7.0-beta1
```

### Notes per block

#### Grafana

The `grafana` block is pre-configured with the dev-datasources and dashboards.

#### Tempo

The Tempo block runs Loki and Prometheus as well and shouldn't be ran with Prometheus as a separate source.
You need to install a Docker plugin for the self logging to work, without it the container won't start.
For installation instructions, refer to the Loki [Install the Docker driver client](https://grafana.com/docs/loki/latest/send-data/docker-driver/#install-the-docker-driver-client) documentation.

#### Jaeger
Jaeger block runs both Jaeger and Loki container. Loki container sends traces to Jaeger and also logs its own logs into itself so it is possible to setup derived field for traceID from Loki to Jaeger. You need to install a docker plugin for the self logging to work, without it the container won't start. See https://grafana.com/docs/loki/latest/clients/docker-driver/#installing for installation instructions.

#### Graphite

| version | source name | graphite-web port | plaintext port | pickle port |
|---------|-------------|-------------------|----------------|-------------|
| 1.1     | graphite    | 8180              | 2103           | 2103        |
| 1.0     | graphite1   | 8280              | 2203           | 2203        |
| 0.9     | graphite09  | 8380              | 2303           | 2303        |

#### MailDev

MailDev block runs an SMTP server and a web UI to test and view emails. This is useful for testing your email notifications locally.

Make sure you configure your .ini file with the following settings:

```ini
[smtp]
enabled = true
skip_verify = true
host = "localhost:1025"
```

You can access the web UI at http://localhost:12080/#/

## Debugging setup in VS Code
An example of launch.json is provided in `devenv/vscode/launch.json`. It basically does what Makefile and .bra.toml do. The 'program' field is set to the folder name so VS Code loads all *.go files in it instead of just main.go.

## Troubleshooting

### Containers that read from log files fail to start (Mac OS)

If you are running Mac OSX, containers that read from the log files (e.g. Telegraf, Fileabeat, Promtail) can fail to start. This is because the default Docker for Mac does not have permission to create `grafana` folder at the `/var/log` location, as it runs as the current user. To solve this issue, manually create the folder `/var/log/grafana`, then start the containers again.

```
sudo mkdir /var/log/grafana
```

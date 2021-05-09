# Monitor3770Bot

透過 SSH 來管理目標電腦（目前僅支援 Windows）的 Telegram Bot

## Demo

![demo image](https://imgur.com/iZilozZ.jpg)

## Usage

### `Docker`

```bash
docker run --name monitor3770bot \
-e BOT_TOKEN='<BOT_TOKEN>' \
-e BOT_ALLOW_LIST='<USER1_ID>,<USER2_ID>' \
-e TARGET_NAME='<COMPUTER_NAME>' \
-e TARGET_IP_ADDRESS='<IP_ADDRESS>' \
-e TARGET_MAC_ADDRESS='<MAC_ADDRESS>' \
-e TARGET_USERNAME='<USERNAME>' \
-e TARGET_PASSWORD='<PASSWORD>' \
--restart=always -d \
--net=host \
pinlin/monitor3770bot
```

### Manual

```bash
# Install dependencies
npm install

# Run on development mode
npm run start:dev
# Run on production mode
npm run build
npm run start
```

## License
[MIT License](LICENSE)

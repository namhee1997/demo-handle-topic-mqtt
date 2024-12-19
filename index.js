require('dotenv').config();
const mqtt = require('mqtt');

const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_PORT = parseInt(process.env.MQTT_PORT, 10);
const MQTT_TOPIC_PUBLISH = process.env.MQTT_TOPIC_PUBLISH;
const MQTT_TOPIC_SUBSCRIBE = process.env.MQTT_TOPIC_SUBSCRIBE;
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID;

const client = mqtt.connect(`mqtt://${MQTT_HOST}`, {
    port: MQTT_PORT,
    clientId: MQTT_CLIENT_ID,
});

// connect success
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Subscribe vào topic để nhận dữ liệu
    client.subscribe(MQTT_TOPIC_PUBLISH, { qos: 2 }, (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', MQTT_TOPIC_PUBLISH);
        } else {
            console.log('Subscribed to topic:', MQTT_TOPIC_PUBLISH);
        }
    });

    client.subscribe('upgrade/status', { qos: 2 }, (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', 'upgrade/status');
        } else {
            console.log('Subscribed to topic:', 'upgrade/status');
        }
    });

    // Gửi thử dữ liệu lên topic publish
    const payload = { message: '2.1', upgrade: true };


    client.publish(MQTT_TOPIC_SUBSCRIBE, JSON.stringify(payload), { qos: 2 }, (err) => {
        if (err) {
            console.error('Failed to publish message:', err);
        } else {
            console.log('Message published to topic:', MQTT_TOPIC_SUBSCRIBE);
        }
    });
});

// Nhận dữ liệu từ topic subscribe
client.on('message', (topic, message) => {
    const data = message.toString();
    console.log({topic});
    
    if (topic === MQTT_TOPIC_PUBLISH) {
        // console.log(`============ ${topic}:`, data);
        try {
            const parsedData = JSON.parse(data);
            console.log('Upgrade request received. Triggering upgrade process...', parsedData.version);
            if (parsedData) {
                // Thực hiện xử lý upgrade tại đây
            }
        } catch (error) {
            console.error('Failed to parse message:', error.message);
        }
    }

    if (topic === 'upgrade/status') {
        try {
            const parsedData = JSON.parse(data);
            console.log('===', parsedData);
        } catch (error) {
            console.error('Failed to parse message:', error.message);
        }
    }
});

// Xử lý lỗi
client.on('error', (err) => {
    console.error('MQTT Client Error:', err);
});

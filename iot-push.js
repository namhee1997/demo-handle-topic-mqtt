const mqtt = require('mqtt');

// Thay URL broker bằng địa chỉ của bạn
const host = 'mqtt://localhost'; // Dùng 'ws' cho WebSocket hoặc 'wss' cho WebSocket bảo mật
const port = process.env.AEDES_PORT || 1883; // Port từ Aedes

// Tạo MQTT Client
const client = mqtt.connect(`${host}:${port}`, {
    clientId: 'webapp', // ID của client
    username: 'namvv', // Thay bằng username (nếu cần)
    password: '123456', // Thay bằng password (nếu cần)
    reconnectPeriod: 1000, // Tự động reconnect sau 1 giây
});

client.on('connect', () => {
    console.log('Connected to Aedes broker!');

    // // Subscribe vào một topic
    const topic = 'devices';
    // client.subscribe(topic, (err) => {
    //     if (err) {
    //         console.error('Failed to subscribe:', err);
    //     } else {
    //         console.log(`Subscribed to topic: ${topic}`);
    //     }
    // });
    let m = 0;
    // Publish dữ liệu
    setInterval(() => {
        client.publish(topic, 'Hello MQTT Broker!' + m, { qos: 1 }, (err) => {
            if (err) {
                console.error('Failed to publish:', err);
            } else {
                console.log('Message published successfully!');
            }
        });
        m++;
    }, 3000);
});

// // Xử lý khi nhận message
// client.on('message', (topic, message) => {
//     console.log({ topic, message: message.toString() });

//     console.log(`Message received on topic ${topic}:`, message.toString());
// });

// Xử lý lỗi
client.on('error', (err) => {
    console.error('Connection error:', err);
});

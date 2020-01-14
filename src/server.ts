import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { Context } from 'aws-lambda';

const app = express();

app.use(express.json({ limit: '50mb' }));

app.get('/healthcheck', (req, res) => res.send({ msg: 'hello Andre, Tom and Nic!' }));

// If local then don't wrap in serverless
if (process.env.NODE_ENV === 'development') {
    app.listen(3030);
} else {
    const server = awsServerlessExpress.createServer(app);
    exports.handler = (event: any, context: Context) => {
        awsServerlessExpress.proxy(server, event, context);
    };
}
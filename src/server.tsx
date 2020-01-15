import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { Context } from 'aws-lambda';
import React from 'react';
import { css } from 'emotion';
import { renderToStaticMarkup } from 'react-dom/server';
import { extractCritical } from 'emotion-server';

const PORT = 3030;

const app = express();

app.use(express.json({ limit: '50mb' }));

const ExampleComponent: React.FC<{}> = () => (
    <div
        className={css`
            font-size: 18px;
        `}
    >
        Hello
        <span
            className={css`
                font-weight: bold;
                color: grey;
            `}
        >
            World
        </span>
    </div>
);

app.get('/', (req, res) => {
    const { html, css } = extractCritical(renderToStaticMarkup(<ExampleComponent />));
    res.send({ html, css });
});

// If local then don't wrap in serverless
if (process.env.NODE_ENV === 'development') {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} else {
    const server = awsServerlessExpress.createServer(app);
    exports.handler = (event: any, context: Context) => {
        awsServerlessExpress.proxy(server, event, context);
    };
}

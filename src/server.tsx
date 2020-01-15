import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { Context } from 'aws-lambda';
import React from 'react';
import { css } from 'emotion';
import { renderToStaticMarkup } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import { headline } from '@guardian/src-foundations/typography';

const ExampleComponent: React.FC<{}> = () => (
    <h1
        className={css`
            ${headline.medium()}
        `}
    >
        Hello World
    </h1>
);

const PORT = 3030;

const app = express();
app.use(express.json({ limit: '50mb' }));

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

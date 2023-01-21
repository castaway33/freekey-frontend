import Document, {Head, Html, Main, NextScript} from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return {...initialProps};
    }

    render() {
        return (
            <Html>
                <Head>
                    <link href={'/css/base.css'} rel={'stylesheet'}/>
                </Head>
                <body style={{visibility: 'hidden'}}>
                <Main/>
                <NextScript/>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function () {
    let href = '/css/white.css'
    if (localStorage.getItem('dark') =='true') {
        href = '/css/dark.css'
    }
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.id='theme'
    head.appendChild(link)
    
    setTimeout(() => {
        document.body.style.visibility = 'visible'
    }, 1000)
})();
              `,
                    }}
                />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

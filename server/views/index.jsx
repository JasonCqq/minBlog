import React from "react";

const Index = ({ reactOutput }) => {
  return (
    <html>
      <head>
        <title>React App</title>
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: reactOutput }}></div>
        <script src="/path/to/your/bundle.js"></script>
      </body>
    </html>
  );
};

export default Index;

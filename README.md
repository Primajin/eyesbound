# Eyesbound

## Development

Create a `.env.development` file with the following content:

```dotenv
API_KEY=Permanent Accesstoken from https://eyesbound.prismic.io/settings/apps/
```

Then run

```shell script
npm start
```

You can now view eyesbound in the browser.

```
http://localhost:8000/
```

View GraphiQL, an in-browser IDE, to explore your site's data and schema

```⠀
http://localhost:8000/___graphql
```

Copy the json from each custom type (e.g. `https://eyesbound.prismic.io/masks/category.json/`) to `src/schemas`.
For better code-completion in Webstorm go to GraphQL tab and click on "Get GraphQL Schema from Endpoint"
This will update the `schema.graphql` file and offer better code completion when working with queries.

`gatsby-node.js` allows for generating routes / pages based on queries. Use the templates in `src/templates` for generation.

Furthermore, reusable components are stored in `src/components` in an atomic design structure.

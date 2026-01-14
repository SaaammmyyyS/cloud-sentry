const awsmobile = {
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT,
      region: import.meta.env.VITE_AWS_APPSYNC_REGION,
      defaultAuthMode: "apiKey",
      apiKey: import.meta.env.VITE_AWS_APPSYNC_API_KEY,
    },
  },
};

export default awsmobile;
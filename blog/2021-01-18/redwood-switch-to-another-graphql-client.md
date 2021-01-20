---
date: "2021-01-18"
title: "Switching to Another GraphQL Client in RedwoodJS"
category: "RedwoodJS"
tags: ["RedwoodJS", "JavaScript", "GraphQL", "Apollo Client", "graphql-hooks"]
banner: "/assets/bg/graph.jpg"
---

RedwoodJS ships with Apollo Client as its default GraphQL client. With the 0.22.0 release of Redwood it's now possible to use another GraphQL client if you want. The key is the new `<GraphQLHooksProvider>` component where you can plug in whatever `useQuery` and `useMutation` hooks you want, as long as they have the correct function signature.

By default when you create a new RedwoodJS app this is what you get in your `index.js` file:

```jsx
ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <AuthProvider client={netlifyIdentity} type="netlify">
      <RedwoodProvider>
        <Routes />
      </RedwoodProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
```

The interesting bit is `<RedwoodProvider>`. Looking at the source for Redwood we see this:

```js
export { RedwoodApolloProvider as RedwoodProvider } from './components/RedwoodApolloProvider'
```

and this:

```tsx
import {
  ApolloProvider,
  ApolloClientOptions,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useMutation,
} from '@apollo/client'

// Other imports...

const ApolloProviderWithFetchConfig: React.FunctionComponent<{
  config?: Omit<ApolloClientOptions<InMemoryCache>, 'cache'>
}> = ({ config = {}, children }) => {
  const { uri, headers } = useFetchConfig()

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri,
    headers,
    ...config,
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export const RedwoodApolloProvider: React.FunctionComponent<{
  graphQLClientConfig?: Omit<ApolloClientOptions<InMemoryCache>, 'cache'>
  useAuth: () => AuthContextInterface
}> = ({ graphQLClientConfig, useAuth, children }) => {
  return (
    <FetchConfigProvider useAuth={useAuth}>
      <ApolloProviderWithFetchConfig config={graphQLClientConfig}>
        <GraphQLHooksProvider useQuery={useQuery} useMutation={useMutation}>
          <FlashProvider>{children}</FlashProvider>
        </GraphQLHooksProvider>
      </ApolloProviderWithFetchConfig>
    </FetchConfigProvider>
  )
}
```

So `<RedwoodProvider>` is a renamed export of `<RedwoodApolloProvider>` that wrapps the `<ApolloProvider>` context around its children, and passes `useQuery` and `useMutation` from `@apollo/client` to `<GraphQLHooksProvider>`.

The new powerful thing is that we can remove `<RedwoodProvider>` from our code and do what it does on our own instead &mdash; and that gives us the ability to pass in other `useQuery` and `useMutation` hooks from some other GraphQL client. For Apollo Client it's super easy. (It's almost as if Redwood was built for usage with Apollo Client 😜) All you have to do is import `useQuery` and `useMutation` and pass them straight into `<GraphQLHooksProvider>`. For any other graphql client you are probably going to have to write some adapter code to make it all work.

The other thing we need to do is to create our graphql client. And the client will need to know what headers to send and what url to talk to. For this we have the `useFetchConfig()` hook. Again, it's super straightforward to use with Apollo Client, but should be fairly easy to use with your client of choice as well.

This is an example of how it can be done when wiring up [graphql-hooks](https://github.com/nearform/graphql-hooks)

```jsx
const useQueryAdapter = (query, options) => {
  return useQuery(print(query), options)
}

const useMutationAdapter = (query, options) => {
  return useMutation(print(query), options)
}

const GraphqlHooksClientProvider = ({ children }) => {
  const { uri: url, headers } = useFetchConfig()

  const client = new GraphQLClient({ url, headers })

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  )
}

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <AuthProvider client={netlifyIdentity} type="netlify">
      <FetchConfigProvider>
        <GraphqlHooksClientProvider>
          <GraphQLHooksProvider
            useQuery={useQueryAdapter}
            useMutation={useMutationAdapter}
          >
            <FlashProvider>
              <Routes />
            </FlashProvider>
          </GraphQLHooksProvider>
        </GraphqlHooksClientProvider>
      </FetchConfigProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
```

The adaptors for the hooks are simple. Only change we had to do was to transform the graphql queries that come as GQL ASTs in to plain strings. We use the `print` function for this. Setting up the client using `useFetchConfig()` is also easy, just have to rename `uri` to `url` for graphql-hooks to be happy.

You can see a full implementation in this GitHub repo: https://github.com/Tobbe/redwood-graphql-hooks (But there really isn't much more to it than what I've shown here.)

So, why do we have to let Redwood know about our `useQuery` and `useMutation` hooks in the first place? `useQuery` is used internally by Redwood with Cells, in its `withCellHOC`. `useMutation` technically wouldn't be necessary. But having it there allows the generators to generate code that runs and is valid. Without it, generated code like this would never be valid: `import { useMutation, useFlash } from '@redwoodjs/web'`. (That line is from the `EditNameCell.js.template` file.)

<span style="font-size: 80%">(Header photo by <a href="https://unsplash.com/@armand_khoury?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Armand Khoury</a> on <a href="https://unsplash.com/s/photos/graph?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>)</span>
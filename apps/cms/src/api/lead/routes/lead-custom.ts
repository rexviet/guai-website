export default {
  routes: [
    {
      method: 'POST',
      path: '/leads',
      handler: 'lead.submit',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};

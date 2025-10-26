export default {
  code: {
    value: null,
    required: true,
    status: null,
    errors: []
  },
  name: {
    value: null,
    required: true,
    status: null,
    errors: []
  },
  amount: {
    value: null,
    required: false,
    status: null
  },
  type: {
    value: null,
    required: true,
    status: null,
    options: [
      { value: 0, name: 'Produto' },
      { value: 1, name: 'Serviço' }
    ],
    errors: []
  },
  cost: {
    value: null,
    required: false,
    status: null
  },
  description: {
    value: null,
    required: false,
    status: null
  }
}

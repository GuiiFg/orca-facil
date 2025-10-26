export default {
    code: {
        value: null,
        required: true,
        status: null,
        errors: []
    },
    name: {
        value: null,
        required: false,
        status: null
    },
    amount: {
        value: null,
        required: false,
        status: null
    },
    type: {
        value: null,
        required: false,
        status: null,
        options: [
            { value: 0, name: 'Produto' },
            { value: 1, name: 'Serviço' }
        ]
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

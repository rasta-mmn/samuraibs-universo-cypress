import signup from '../support/pages/signup'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {
    context('quando o usuário é novo', () => {
        const user = {
            name: 'Miguel Molina Neto',
            email: 'mmn@samuraisr.com',
            password: 'pwd12345',
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('quando o email já existe', () => {
        const user = {
            name: 'João Lucas',
            email: 'joao@samuraibs.com',
            password: 'pwd1234',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('então não deve cadastrar o usuario', () => {

            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        });

    })

    context('quando o email é incorreto', () => {
        const user = {
            name: 'Elisabeth Olsen',
            email: 'lisa.samuraibs.com',
            password: 'pwd1234',
        }

        it('deve exibir mensagem de alerta', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando a senha é muito curta', () => {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'abc#5']

        beforeEach(() => {
            signupPage.go()
        })

        passwords.forEach((p) => {
            it('não deve cadastrar com a senha: ' + p, () => {

                const user = {
                    name: 'Jason Friday',
                    email: 'jason@gmail.com',
                    password: p,
                }
                signupPage.form(user)
                signupPage.submit()

            })
        })

        afterEach(() => {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context.only('quando não preencher todos os campos', () => {

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(()=>{
            signupPage.go()
            signupPage.submit()
        })

        it('deve exibir todas as mensagens de alerta', () => {
                alertMessages.forEach(alert => {
                signupPage.alertHaveText(alert)
            })
        })

/*      alertMessages.forEach((alert)=>{
            it('deve exibir ' + alert.toLowerCase(), ()=>{
                signupPage.alertHaveText(alert)
            })
        }) */

    })
})

const express = require('express');
const session = require('express-session');
const app = express();
const port = '3500';

//Sequelize modules import
const Setor = require('./module/Setor');
const Cargo = require('./module/Cargo');
const Gestor = require('./module/Gestor');
const Colaborador = require('./module/Colaborador');

//Router imports
const cadastrar = require('./routes/cadastrar');
const home = require('./routes/home');
const addColab = require('./routes/addColab');
const Edit = require('./routes/edit');

/////{ CONFIGURAÇÕES }//////////////////////////////////////////////////////////////////////////////////

//Session config
app.use(session({
    secret: 'vigillatus',
    resave: false,
    saveUninitialized: true
}));

//Static files config
app.use(express.static('public'));

//Body-parser config
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware para adicionar a variável user às respostas se o usuário estiver autenticado
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user; // Adiciona a variável user aos locais de resposta
    }
    next(); // Chama o próximo middleware na cadeia
});

//Configurando EJS como view engine
app.set('view engine', 'ejs');

/////{ ROTAS }//////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Server on: http://localhost:${port}`);
});

//Rota para o a tela de login
app.get('/', (req, res) => {
    res.render('index.ejs', { error: null });

    Colaborador;
    Gestor;
    Setor;
    Cargo;
});

//Fazendo verificação básica para o usuário exevutar o login
app.post('/login', async (req, res) => {

    const { email, senha } = req.body;

    //Buscando usuário através do email
    const identifyUser = await Gestor.findOne({ where: { email } });

    //verifica existência do usuário
    if (!identifyUser) {
        console.log('Usuário não encontrado');
        res.render('index.ejs', { error: 'Usuário não encontrado' });
    } else {
        //Verifica se a senha do usuário é igual a do banco
        if (senha == identifyUser.senha) {
            //Verifica se o cargo do usuário é de um nível adequado para entrar
            const cargo = await Cargo.findByPk(identifyUser.idCargo);
            if (cargo && cargo.nivel) {
                // Passando os dados do usuário na sessão
                req.session.user = identifyUser;
                res.redirect('/home');
            } else {
                res.render('index.ejs', { error: 'Usuário não autorizado' });
            }

        } else {
            res.render('index.ejs', { error: 'Senha incorreta' });
        }
    }

    Gestor;

});

// Rota para fazer logout
app.get('/logout', (req, res) => {
    // Limpar a sessão do usuário
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            // Redirecionar para a página de login ou para qualquer outra página desejada
            res.redirect('/');
        }
    });
});

//Rota para tela de cadastramento
app.use('/cadastrar', cadastrar);

//Rota para a tela home (parte interna da aplicação)
app.use('/home', home);

//Rota para a tela de cadastro de colaboradores
app.use('/home/addColab', addColab);

//Rota para a tela de edição de perfil do *gestor
app.use('/home/perfilGestor/edit', Edit);
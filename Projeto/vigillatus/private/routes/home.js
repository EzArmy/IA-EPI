const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

//module import
const Colaborador = require('../module/Colaborador');
const Cargo = require('../module/Cargo');
const Setor = require('../module/Setor');

/* Configurações */

const colabFotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const gestorInfo = req.session.user;
        const pastaGestor = `./public/uploads/${gestorInfo.id}/`;
        const pastaColab = pastaGestor + 'Colaboradores/' + req.params.id;

        if (!fs.existsSync(pastaColab)) {
            fs.mkdirSync(pastaColab, { recursive: true });
        }

        cb(null, pastaColab);
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname);
        cb(null, fileName)
    }
});

const uploadColabFoto = multer({ storage: colabFotoStorage });

/* Rotas */
router.get('/', (req, res) => {

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('home.ejs', { gestorInfo, imagePath });
});

//Rota para a página de perfil do gestor
router.get('/perfilGestor', async (req, res) => {

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    //Trazendo cargo do gestor
    const gestorCargo = await Cargo.findOne({
        where: { id: [gestorInfo.idCargo] }
    });

    //Trazendo setor do gestor
    const gestorSetor = await Setor.findOne({
        where: { id: [gestorInfo.idSetor] }
    });

    res.render('pageGestor.ejs', {
        gestorInfo,
        imagePath,
        gestorCargo,
        gestorSetor,
        morrer: null
    });
});

// Middleware para renomear as pastas dos colaboradores
router.use('/colaboradores', async (req, res, next) => {
    const gestorInfo = req.session.user;

    // Listando colaboradores vinculados ao gestor
    const listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorInfo.id] }
    });

    // Renomear as pastas dos colaboradores
    listColaborador.forEach(colaborador => {
        const colabOldFolder = `./public/uploads/${gestorInfo.id}/Colaboradores/${colaborador.nome}`;
        const colabNewFolder = `./public/uploads/${gestorInfo.id}/Colaboradores/${colaborador.id}`;

        if (fs.existsSync(colabOldFolder)) {
            fs.renameSync(colabOldFolder, colabNewFolder);
        }
    });

    // Passa para a próxima função de middleware ou rota
    next();
});

// Rota para a página de Colaboradores
router.get('/colaboradores', async (req, res) => {

    const gestorInfo = req.session.user;

    // Listando colaboradores vinculados ao gestor
    const listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorInfo.id] }
    });

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('colaboradores.ejs', {
        imagePath,
        listColaborador,
        gestorInfo
    });
});

//Rota para a página de detalhes de um colaborador
router.get(`/colaboradores/:id/`, async (req, res) => {

    const colabId = req.params.id;

    //Listando colaboradores vinculados ao gestor
    const listColabInfo = await Colaborador.findAll({
        where: { id: [colabId] }
    });

    //Listando cargo dos colaboradores
    const listColabCargo = await Cargo.findAll({
        where: { id: [listColabInfo.idCargo] }
    });

    //Colentando dados do gestor logado
    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('pageColab.ejs', {
        colabId,
        listColabInfo,
        gestorInfo,
        listColabCargo,
        imagePath
    });
});

router.get(`/colaboradores/:id/editColab`, async (req, res) => {

    /* Capturando ID do colaborador que terá seus dados editados */
    const colabId = req.params.id;

    /* Capturando informações do gestor */
    const gestorInfo = req.session.user;

    /* Passando imagem para o menu */
    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';
    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            nivel: 2
        }
    });

    const findColab = await Colaborador.findOne({
        where: {
            id: colabId
        }
    });

    res.render('editColab.ejs', {
        findColab,
        listaSetores,
        listaCargos,
        imagePath,
        gestorInfo
    });
});

router.post('/colaboradores/:id/editColab/colabUpdate', uploadColabFoto.single('colabFoto'), async (req, res) => {

    const colabId = req.params.id;

    const gestorInfo = req.session.user;

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            nivel: 2
        }
    });

    /* Capturando id do colaborador */
    const findColab = await Colaborador.findOne({
        where: {
            id: colabId
        }
    });

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    const {
        colabNome,
        colabEmail,
        colabSetor,
        colabCargo
    } = req.body;

    let colabFoto;

    if (req.file) {
        colabFoto = req.file.filename;
    } else {
        // Se nenhuma nova imagem for enviada, mantenha a imagem existente
        colabFoto = findColab.foto; // Use a foto atual do colaborador
    }

    /*  // Verificar se todos os campos obrigatórios estão preenchidos
    if (!colabNome || !colabEmail || !colabSetor || !colabCargo) {
        return res.render('addColab.ejs', { error: 'Todos os campos são obrigatórios', listaSetores, listaCargos, imagePath, gestorInfo });
    } */

    try {
        await Colaborador.update({
            nome: colabNome,
            email: colabEmail,
            foto: colabFoto,
            idSetor: colabSetor,
            idCargo: colabCargo,
            idGestor: req.session.user.id
        }, {
            where: { id: colabId }
        });

        res.redirect('/home/colaboradores')

    } catch (error) {
        console.error('Erro:', error);
        return res.render('editColab.ejs', {
            error: 'Erro ao editar colaborador',
            listaSetores,
            listaCargos,
            imagePath,
            gestorInfo,
            findColab
        });
    }
});

router.post("/colaboradores/:id/colabDelete", async (req, res)=>{
    const gestorInfo = req.session.user;
    const colabId = req.params.id;

    try{
        await Colaborador.destroy({
            where:{
                id:colabId
            }
        });

        /* Excluindo pasta do colaborador */
        const pastaColab = `./public/uploads/${gestorInfo.id}/colaboradores/${colabId }`;
        if (fs.existsSync(pastaColab)) {
            fs.rmdirSync(pastaColab, { recursive: true });
        }

        /* Redirecionando para a página de colaboradores */
        res.redirect('/home/colaboradores');
    }catch(error){
        console.error('Erro ao deletar colaborador:', error);
        res.redirect('/home/colaboradores');
    }


});

module.exports = router;
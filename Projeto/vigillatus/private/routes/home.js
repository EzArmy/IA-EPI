const express = require('express');
const router = express.Router();

//module import
const Colaborador = require('../module/Colaborador');
const Cargo = require('../module/Cargo');
const Setor = require('../module/Setor');

router.get('/', (req, res) => {
    const user = req.session.user;
    const imagePath = user ? `/uploads/${user.nome}/${user.foto}` : `/uploads/${user.nome}/${user.foto}`;
    res.render('home.ejs', { user, imagePath });
});

//Rota para a página de Colaboradores
router.get('/colaboradores', async (req, res) => {

    const gestorId = req.session.user;

    //Listando colaboradores vinculados ao gestor
    const listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorId.id] }
    });

    //caminho para as imagens apresentadas no menu
    const imagePath = req.session.user ? `/uploads/${req.session.user.nome}/${req.session.user.foto}` : `/uploads/${req.session.user.nome}/${req.session.user.foto}`;

    const infoGestor = req.session.user;

    res.render('colaboradores.ejs', {
        imagePath,
        listColaborador,
        infoGestor
    });
});

router.get(`/colaboradores/:id/:nome`, async (req, res) => {

    const colabId = req.params.id;

    //Listando colaboradores vinculados ao gestor
    const listColabInfo = await Colaborador.findAll({
        where: { id: [colabId] }
    });

    const listColabCargo = await Cargo.findAll({
        where: { id: [listColabInfo.idCargo] }
    });

    //Colentando dados do gestor logado
    const gestorInfo = req.session.user;

    //caminho para as imagens apresentadas no menu
    const imagePath = req.session.user ? `/uploads/${req.session.user.nome}/${req.session.user.foto}` : `/uploads/${req.session.user.nome}/${req.session.user.foto}`;

    res.render('pageColab.ejs', {
        colabId,
        listColabInfo,
        gestorInfo,
        listColabCargo,
        imagePath
    });
});

router.get('/perfilGestor', async (req, res) => {

    const gestorInfo = req.session.user;

    //caminho para as imagens apresentadas no menu
    const imagePath = gestorInfo ? `/uploads/${gestorInfo.nome}/${gestorInfo.foto}` : `/uploads/${gestorInfo.nome}/${gestorInfo.foto}`;

    const gestorCargo = await Cargo.findOne({
        where: {id:[gestorInfo.idCargo]}
    });

    const gestorSetor = await Setor.findOne({
        where: {id:[gestorInfo.idSetor]}
    });

    console.log(gestorInfo.idCargo);

    res.render('pageGestor.ejs', {
        gestorInfo,
        imagePath,
        gestorCargo,
        gestorSetor
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

//module import
const Colaborador = require('../models/Colaborador');
const Cargo = require('../models/Cargo');
const Setor = require('../models/Setor');

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

// Função de Merge Sort
// Função de Merge Sort
function mergeSort(arr, key, order = 'asc') {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(
        mergeSort(left, key, order),
        mergeSort(right, key, order),
        key,
        order
    );
}

function merge(left, right, key, order) {
    let resultArray = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (order === 'asc') {
            if (left[leftIndex][key] < right[rightIndex][key]) {
                resultArray.push(left[leftIndex]);
                leftIndex++;
            } else {
                resultArray.push(right[rightIndex]);
                rightIndex++;
            }
        } else {
            if (left[leftIndex][key] > right[rightIndex][key]) {
                resultArray.push(left[leftIndex]);
                leftIndex++;
            } else {
                resultArray.push(right[rightIndex]);
                rightIndex++;
            }
        }
    }

    return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

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

    // ronomeando as pastas dos colaboradores
    listColaborador.forEach(colaborador => {
        const gestorPastaAntiga = `./public/uploads/${gestorInfo.id}/Colaboradores/${colaborador.nome}`;
        const gestorPastaNova = `./public/uploads/${gestorInfo.id}/Colaboradores/${colaborador.id}`;

        if (fs.existsSync(gestorPastaAntiga)) {
            fs.renameSync(gestorPastaAntiga, gestorPastaNova);
        }
    });

    next();
});

// Rota para a página de Colaboradores
router.get('/colaboradores', async (req, res) => {
    const gestorInfo = req.session.user;

    // Listando colaboradores vinculados ao gestor
    let listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorInfo.id] }
    });

    //Listando setores
    let listaSetores = await Setor.findAll();

    // Mapeando o array de colaboradores para apresentar o nome do cargo e setor
    for (let colab of listColaborador) {
        const cargo = await Cargo.findOne({ where: { id: colab.idCargo } });
        colab.cargo = cargo.nome;
        const setor = await Setor.findOne({ where: { id: colab.idSetor } });
        colab.setor = setor.descricao;
    }

    // Aplicando a ordenação com base nos filtros selecionados
    const { sort } = req.query;

    if (sort) {
        const [sortKey, sortOrder] = sort.split('-');
        listColaborador = mergeSort(listColaborador, sortKey, sortOrder);
    }

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('colaboradores.ejs', {
        imagePath,
        listaSetores,
        listColaborador,
        gestorInfo,
        error: null
    });
});

/* Rota de pesquisa */
router.post('/colaboradores/search/', async (req, res) => {
    /* Trazendo dados do colaborador */
    const gestorInfo = req.session.user;

    /* Capturando valor no input de pesquisa */
    const { searchColab } = req.body;

     const listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorInfo.id] }
    }); 

    try {
        // Listando colaboradores vinculados ao gestor
        const foundColab = await Colaborador.findAll({
            where: {
                idGestor: gestorInfo.id,
                nome: {
                    [Op.like]: `${searchColab}%`
                }
            }
        });

        let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

        // Se imagePath for null ou vazio, define a imagem padrão
        imagePath = imagePath || '/img/profile/default.jpg';

        if (foundColab.length > 0) {
            res.render('search.ejs', {
                searchColab,
                gestorInfo,
                imagePath,
                foundColab
            });
        } else {
            res.render('colaboradores.ejs', {
                imagePath,
                listColaborador,
                gestorInfo,
                error:'OH SHIT'
            });
        }
    } catch (error) {
        res.render('colaboradores.ejs', {
            imagePath,
            listColaborador,
            gestorInfo,
            error:'OH SHIT'
        });
    }
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
        imagePath,
        error:null
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

router.post("/colaboradores/:id/colabDelete", async (req, res) => {
    const gestorInfo = req.session.user;
    const colabId = req.params.id;

    try {
        await Colaborador.destroy({
            where: {
                id: colabId
            }
        });

        /* Excluindo pasta do colaborador */
        const pastaColab = `./public/uploads/${gestorInfo.id}/colaboradores/${colabId}`;
        if (fs.existsSync(pastaColab)) {
            fs.rmdirSync(pastaColab, { recursive: true });
        }

        /* Redirecionando para a página de colaboradores */
        res.redirect('/home/colaboradores');
    } catch (error) {
        console.error('Erro ao deletar colaborador:', error);
        res.redirect('/home/colaboradores');
    }

});

router.get('/cameras', (req, res)=>{

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('camera.ejs',  {gestorInfo, imagePath});
});

module.exports = router;
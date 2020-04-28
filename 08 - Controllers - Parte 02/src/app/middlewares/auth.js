import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // se o usuario nao estiver autenticado com o token, deve emitir este aviso
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  // o retorno vem com a palavra bearer e o token
  // entao se torna necessario dividir isto (por meio do espaço)
  // vai retornar um array com 2 palavras, o bearer na primeira posicao e o token na segunda
  // com a virgula (desestruturacao), eu descarto a primeira posicao e uso somente a segunda
  const [, token] = authHeader.split(' ');

  try {
    // para nao ter que usar a funcao com os padroes antigos de callback
    // foi usado o promisify, assim ele gera uma nova funcao sem callback
    // a funcao retornada está no segundo parenteses, sendo passado os parametros
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // se der certo, as informacoes que geramos no token vao ser armazenadas no decoded
    // por exemplo, no payload do token está o id que passamos
    // caso dê algo errado, ele vai para o catch
    // ele retorna os dados de id, exp (formato timestamp)
    // console.log(decoded);

    // podemos incluir o id do usuario dentro do req
    // se quisermos alterar o usuario (update), qual usuario vou alterar?
    // nao vou enviar pela url seu id, basta pegar o usuario com o id no token
    // assim eu pego la no controller do update o id do user pelo req
    req.idCompany = decoded.id;
    req.cnpjCompany = decoded.cnpj;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid!' });
  }
};

const _ = require('lodash');
var mysql = require('mysql');

var dbConfig = {
  host: 'localhost',
  user: 'hjinny',
  password: '1234',
  port: 3306,
  database: 'ppl',
  use_prepared_statements: 'N'
};
var pool = mysql.createPool(dbConfig);

exports.routers = (app) => {


    /**
     * Middleware for checking user with token access id
     *
     */

    const allowAuthenticatedUser = (req, res, next) => {


        let tokenId = req.get('authorization');
        if (!tokenId) {
            tokenId = req.query.auth;
        }


        if (!tokenId) {

            return errorHandle(res, "Access denied", 401);
        } else {

            // let veriy this token

            app.models.token.load(tokenId, (err, result) => {

                if (err) {

                    return errorHandle(res, "Access denied", 401);
                }

                req.ctx = {
                    token: result
                };

                return next();

            });

        }

    };

    /**
     * Error Handle in response
     * @param res
     * @param errorMessage
     * @param code
     * @returns {*|JSON|Promise<any>}
     */
    const errorHandle = (res, errorMessage, code = 500) => {

        return res.status(code).json({error: {message: errorMessage}});
    };

    /**
     * Success response handler
     * @param res
     * @param data
     * @param code
     * @returns {*|JSON|Promise<any>}
     */

    const responseHandle = (res, data, code = 200) => {

        return res.status(code).json(data);
    };


    /**
     * @method GET
     * @endpoint /
     * @description Root api
     *
     */

    app.get('/', (req, res) => {

        return res.json({version: '1.0'});
    });


    /**
     * @method POST
     * @endpoint /api/users
     * @description create new user
     *
     */

    app.post('/api/users', function (req, res, next) {     
        pool.getConnection(function (err, conn) {
          if (err) {
            throw err;
          }
          var sql = "select * from user where id = ?";
          conn.query(sql, [req.body.id], (err, row) => {
            if (err) {
              throw err;
            }
            if (row.length === 0) {
              var sql = "insert into user values (?, ?, ?)";
              conn.query(sql, [req.body.id, req.body.name, req.body.password], function (err, row) {
                conn.release();
                if (err) {
                  throw err;
                }
                return err ? errorHandle(res, err, 503) : responseHandle(res, row);
              });
            }
            else {
              res.send("<script>alert('중복된 아이디입니다.');history.back();</script>");
            }
          });//회원가입 요청
        })
      });

    /**
     * @method POST
     * @endpoint /api/login
     * @description Login a user and return token object
     *
     */


    app.post('/api/login', function (req, res, next) {
        const body = req.body;
        pool.getConnection((err, conn) => {
            var sql = "select * From user where id = ? AND password = ?";
            conn.query(sql, [body.id, body.password], (err, result) => {
              conn.release();
              if (err) {
                res.send(300, {
                  result: 0,
                  msg: 'DB Error'
                });
              }
              else {
                return responseHandle(res, result);      
              }
            });
      })
    });//로그인 요청

    /**
     * @method POST
     * @endpoint /api/getPPL
     * @description PPL정보를 가져오는 요청
     *
     */
    app.post('/api/getPPL', function (req, res, next) {
        const pplTime =  req.body.time
        pool.getConnection((err, conn) => {
            var sql = "select ppl.*, count(user_has_ppl.ppl_pId) as pLike from ppl, user_has_ppl where ppl.pId=user_has_ppl.ppl_pId and ?<=ppl.pEndTime and ?>=ppl.pStartTime group by user_has_ppl.ppl_pId";
              conn.query(sql, [pplTime, pplTime], (err, result) => {
                conn.release();
                      if (err) {
                        throw err;
                      }
                      console.log(res);
                      return responseHandle(res, result)
                    });
            });
      });
    /**
     * @method POST
     * @endpoint /api/getPPL
     * @description PPL정보를 가져오는 요청
     *
     */
    app.post('/api/getLikeNum', function (req, res, next) {
      const pplTime =  req.body.time
      pool.getConnection((err, conn) => {
          var sql = "select count(case when ppl_pId=? then 1 and) as likNum from user_has_ppl ";
          conn.query(sql, [pId], (err, result) => {
            conn.release();
            if (err) {
              res.send(300, {
                result: 0,
                msg: 'DB Error'
              });
            }
            else {
              return responseHandle(res, result);    
            }
          });
    })
  });
    /**
     * @method POST
     * @endpoint /api/getLikeItem
     * @description 이용자가 좋아요누른 아이템 가져오기
     *
     */
    app.post('/api/getLikeItem', function (req, res, next) {
      const uId =  req.body.uId;
      pool.getConnection((err, conn) => {
          var sql = "select ppl.* From ppl,user_has_ppl where user_has_ppl.user_id=? and user_has_ppl.ppl_pId=ppl.pId";
          conn.query(sql, [uId], (err, result) => {
            conn.release();
            if (err) {
              res.send(300, {
                result: 0,
                msg: 'DB Error'
              });
            }
            else {
              return responseHandle(res, result);    
            }
          });
    })
  });

    /**
     * @method POST
     * @endpoint /api/like
     * @description PPL정보 좋아요 기능
     *
     */
    app.post('/api/like', function (req, res, next) {
      pool.getConnection((err, conn) => {
        var sql ="select * from user_has_ppl where user_id=? and ppl_pId=?"
        conn.query(sql,[req.body.uId,req.body.pId],(err,resulet)=>{
          if(resulet.length === 0){
          var sql = "insert into user_has_ppl values (?,?)";
          conn.query(sql, [req.body.uId, req.body.pId], (err, result) => {
            conn.release();
            if (err) {
              res.send(300, {
                result: 0,
                msg: 'DB Error'
              });
            }
            else {
              return responseHandle(res, result);    
            }
          });
          }else{
            var sql ="delete from user_has_ppl where user_id=? and ppl_pId=?"
            conn.query(sql,[req.body.uId,req.body.pId],(err,result)=>{
            conn.release();
                  if (err) {
                    throw err;
                  }
                  if (result) {
                    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
                    res.write("<script>alert('삭제가 완료되었습니다.');location.href='/mypage';</script>")
                  }
                  else {
                    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
                    res.write("<script>alert('삭제가 되지 않았습니다.');history.back();</script>")
                  }
            })
          }
        })
    })
  });

};

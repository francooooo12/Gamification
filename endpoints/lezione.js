function endpoint(app, connpool) {
 
    app.post("/api/lezione", (req, res) => {
        var errors = [];
       
        var data = {
            data: req.body.data,
            descrizione: req.body.descrizione,
            MateriaID: req.body.MateriaID
        }
 
        var sql = 'INSERT INTO lezione (data, descrizione, MateriaID) VALUES (?,?,?)'
        var params = [data.data, data.descrizione, data.MateriaID]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });
 
    })
 
 
 
    app.get("/api/lezione", (req, res, next) => {
        var sql = "select * from lezione"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });
 
 
    app.get("/api/lezione/:id", (req, res) => {
        var sql = "select * from lezione where IDl = ?"
        var params = [req.params.id]
<        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });
 
 
    app.put("/api/lezione/:id", (req, res) => {
        var data = {
            nome: req.body.nome,
            citta: req.body.citta,
        }
        connpool.execute(
            `UPDATE lezione set
               data = COALESCE(?,data),
               descrizione = COALESCE(?,descrizione)
               MateriaID = COALESCE(?,MateriaID)
               WHERE IDl = ?`,
            [data.data, data.descrizione, data.MateriaID, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })
 
 
 
    app.delete("/api/lezione/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM lezione WHERE IDl = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })
 
 
}
 
 
 
 
 
module.exports = endpoint;
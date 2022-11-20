const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'owner',
  host: '217.160.191.154',
  database: 'uni_db',
  password: 'oIARBQgl@Na3AM',
  port: 6543,
})

app.get('/', (req, res) => {
  res.send('{"message": "Hello world"}');
});

app.get('/alcoholic/:a/inspectors', (req, res) => {
  const alcoholicId = req.params.a;
  const from = req.query.F;
  const to = req.query.T;
  const joinCount = req.query.N;
  const values = [alcoholicId, from, to, joinCount];

  const sql = `
  WITH CTE AS
	(SELECT INS.*,
			COUNT(INS.INSPECTOR_ID) JOINCOUNT
		FROM ACT.BED BE
		JOIN ACT.JOIN J ON J.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = J.GENERAL_ID
		JOIN PERSON.INSPECTOR INS ON INS.INSPECTOR_ID = J.INSPECTOR_ID
		WHERE BE.ALCOHOLIC_ID = $1
			AND GEN.CREATED_AT <= $2
			AND GEN.CREATED_AT >= $3
		GROUP BY INS.INSPECTOR_ID,
			INS.FULL_NAME,
			INS.DOB,
			INS.PHONE_NUMBER)
SELECT *
FROM CTE
WHERE CTE.JOINCOUNT >= $4
  `;

  pool.query(sql, values, (error, results) => {
    if (error) {
      req.status(500).json({ok: false, error: error, data: null});
    }
    res.status(200).json({ok: true, error: null, data: results.rows});
  })
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});

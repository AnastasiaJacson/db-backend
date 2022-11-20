const express = require('express');
const bodyParser = require('body-parser');
const { fail, success } = require('./generic-models');
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
});

const checkBedStatus = async bedId => {
  const query = `
  WITH cte AS (SELECT
    'join' EventType,
    gen.created_at HappenedAt,
    be.status
    FROM act.bed be
    JOIN act.join j ON j.bed_event_id = be.bed_event_id
    JOIN act.general gen ON gen.general_id = j.general_id
    WHERE be.bed_id = $1
    UNION ALL
    SELECT
    'leave' EventType,
    gen.created_at HappenedAt,
    be.status
    FROM act.bed be
    JOIN act.leave l ON l.bed_event_id = be.bed_event_id
    JOIN act.general gen ON gen.general_id = l.general_id
    WHERE be.bed_id = $1
    UNION ALL
    SELECT
    'escape' EventType,
    gen.created_at HappenedAt,
    be.status
    FROM act.bed be
    JOIN act.escape e ON e.bed_event_id = be.bed_event_id
    JOIN act.general gen ON gen.general_id = e.general_id
    WHERE be.bed_id = $1
    UNION ALL
    SELECT
    'bed_change_to' EventType,
    gen.created_at HappenedAt,
    be.status
    FROM act.bed be
    JOIN act.bed_change bc ON bc.to_bed_event_id = be.bed_event_id
    JOIN act.general gen ON gen.general_id = bc.general_id
    WHERE be.bed_id = $1
    UNION ALL
    SELECT
    'bed_change_to' EventType,
    gen.created_at HappenedAt,
    be.status
    FROM act.bed be
    JOIN act.bed_change bc ON bc.from_bed_event_id = be.bed_event_id
    JOIN act.general gen ON gen.general_id = bc.general_id
    WHERE be.bed_id = $1)
    SELECT
    status
    FROM cte
    ORDER BY HappenedAt DESC
    LIMIT 1
  `;

  const values = [bedId];

  const result = await pool.query(query, values);
  return result.rows[0].status;
}

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
      req.status(500).json(fail(error));
    }
    res.status(200).json(success(results.rows));
  })
});

app.post('/inspectors', (req, res) => {
  const query = `
  INSERT INTO person.inspector (full_name, dob, phone_number)
  VALUES ($1, $2, $3);
  `
  const values = [req.body.fullName, req.body.dob, req.body.phoneNumber];

  pool.query(query, values, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result));
  });
});

app.get('/inspectors', (req, res) => {
  const query = `
  SELECT * FROM person.inspector;
  `;
  pool.query(query, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result.rows));
  });
});

app.post('/alcoholics', (req, res) => {
  const query = `
  INSERT INTO person.alcoholic (full_name, dob, phone_number)
  VALUES ($1, $2, $3);
  `
  const values = [req.body.fullName, req.body.dob, req.body.phoneNumber];

  pool.query(query, values, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result));
  });
});

app.get('/alcoholics', (req, res) => {
  const query = `
  SELECT * FROM person.alcoholic;
  `;
  pool.query(query, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result.rows));
  });
});

app.post('/drinks', (req, res) => {
  const query = `
  INSERT INTO entity.drink (title, proof)
  VALUES ($1, $2);
  `
  const values = [req.body.title, +req.body.proof];

  pool.query(query, values, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result));
  });
});

app.get('/drinks', (req, res) => {
  const query = `
  SELECT * FROM entity.drink;
  `;
  pool.query(query, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result.rows));
  });
});

app.post('/beds', (req, res) => {
  const query = `
  INSERT INTO entity.bed DEFAULT VALUES;
  `;

  pool.query(query, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result));
  });
});

app.get('/beds', (req, res) => {
  const query = `
  SELECT * FROM entity.bed;
  `;
  pool.query(query, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result.rows));
  });
});

app.post('/act/join', async (req, res) => {
  const bedStatus = await checkBedStatus(req.body.bedId);
  if (bedStatus == 'occupied') {
    res.status(400).json(fail({messsage: 'Bed is in use'}));
    return;
  }

  const values = [req.body.alcoholicId, req.body.bedId, req.body.inspectorId];
  
  const query = `
  WITH CTE AS
	(INSERT INTO ACT.GENERAL DEFAULT
		VALUES RETURNING GENERAL_ID),
	CTE2 AS
	(INSERT INTO ACT.BED (ALCOHOLIC_ID, BED_ID, status)
		VALUES ($1,$2, 'occupied') RETURNING BED_EVENT_ID)
INSERT INTO ACT.JOIN (BED_EVENT_ID,
GENERAL_ID,
INSPECTOR_ID)
SELECT BED_EVENT_ID,
	GENERAL_ID, $3
FROM CTE,
	CTE2;
  `;
  pool.query(query, values, (error, result) => {
    if (error) {
      res.status(500).json(fail(error));
    }
    res.status(200).json(success(result));
  });
});

app.listen(3000, () => {
  console.log(`App is up`);
});

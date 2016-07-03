var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/:sid/rtest', function (req, res) {
    var sid = req.params.sid;
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;

    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/twexam", function (err, db) {
        if (err) { return console.dir(err); }
        db.collection('school').findOne({ sid: sid }, function (err, doc) {
            console.log(doc);
            res.render('rtest', { title: 'R測試頁', sid: sid, school: doc });
        });
    });
});
router.get('/:sid/exams', function (req, res) {
    var sid = req.params.sid;
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;

    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/twexam", function (err, db) {
        if (err) { return console.log(err); }

        db.collection('school').findOne({ sid: sid }, function (err, doc) {
            if (err) { return console.log(err); }

            res.render('exams', { sid: sid, school: doc });
        });


    });
});
router.get('/:sid/showrefs', function (req, res) {
    var sid = req.params.sid;
    var pno = req.query.pno;
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;

    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/twexam", function (err, db) {
        if (err) { return console.log(err); }

        db.collection('school').findOne({ sid: sid }, function (err, school) {
            if (err) { return console.log(err); }
            db.collection('paper').findOne({ _id: pno }, function (err, paper) {
                if (err) { return console.log(err); }
                res.render('showrefs', { sid: sid, school: school, paper: paper });
            });
        });
    });
});
router.get('/examjson', function (req, res) {
    var pageStr = req.query.page;
    var limitStr = req.query.limit;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var sid = req.query.sid;
    var level = req.query.level;
    var semester = req.query.semester;
    var grade = req.query.grade;
    var subject = req.query.subject;
    var examtype = req.query.examtype;

    if (!limitStr)
        limit = 20;
    else
        limit = Number(limitStr);

    if (!pageStr)
        page = 1;
    else
        page = Number(pageStr);


    //console.log(' page:' + page + ' limit:' + limit + ' sidx:' + sidx + ' sord:' + sord + ' sid:' + sid);
    //console.log(' sid:' + sid + ' level:' + level + ' semester:' + semester);
    //console.log(' grade:' + grade + ' subject:' + subject + ' examtype:' + examtype);

    var filter = { sid: sid };
    if (semester != 'All')
        filter.semester = semester;

    if (grade != 'All')
        filter.grade = grade;

    if (subject != 'All') {
        if (level == '國中' && subject == '自然')
            filter.subject = { $in: ['自然', '理化', '生物', '地球科學']};
        else if (level == '國中' && subject == '社會')
            filter.subject = { $in: ['社會', '公民', '歷史', '地理']};
        else
            filter.subject = subject;
    }

    if (examtype != 'All')
        filter.examtype = examtype;

    switch (sidx) {
        case "semester":
            if (sord =='asc')
                var sorter = { semester: 1 };
            else
                var sorter = { semester: -1 };
            break;
        case "grade":
            if (sord == 'asc')
                var sorter = { grade: 1 };
            else
                var sorter = { grade: -1 };
            break;
        case "subject":
            if (sord == 'asc')
                var sorter = { subject: 1 };
            else
                var sorter = { subject: -1 };
            break;
        case "examtype":
            if (sord == 'asc')
                var sorter = { examtype: 1 };
            else
                var sorter = { examtype: -1 };
            break;
        default:
            var sorter = {};
    }

	/* Read test json examtype
	 * 

    fs = require('fs')
    fs.readFile('./data/exam.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.send(data);
        res.end();
    });*/
	
	// Retrieve
	var MongoClient = require('mongodb').MongoClient;
	
	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/twexam", function (err, db) {
        if (err) { return console.dir(err); }
        //$sql = "SELECT * FROM paper WHERE ".$filter." ORDER BY $sidx $sord LIMIT $start , $limit";
        //var filter = { sid: sid, level: level, semester: semester, grade: grade, subject: subject };
        //var filter = { sid: sid};
        db.collection('paper').find(filter).count(function (err, count) {
            if (err) { return console.log(err); }
            //{"records":"270","page":"1","total":14,"rows":[{"pno":"97950","semester":"1042","
            var total = Math.ceil(count / limit);
            var all = { records: count, page: page, total: total};
            var skipCount = (page - 1) * limit;
            
            db.collection('paper').find(filter).sort(sorter).skip(skipCount).limit(limit).toArray(function (err, docArray) {
                if (err) { return console.log(err); }

                for (var i = 0, len = docArray.length; i < len; i++) {
                    if (docArray[i].publisher == "" || docArray[i].publisher == "其他")
                        docArray[i].refpaper = 'none';
                    else
                        docArray[i].refpaper = docArray[i]._id;
                }

                all.rows = docArray;
                res.send(all);
                res.end();
                db.close();
            });
        });
	});
});
router.get('/refsjson', function (req, res) {
    var pageStr = req.query.page;
    var limitStr = req.query.limit;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    var sname = req.query.sname;
    var examtype = req.query.examtype;
    var anstype = req.query.anstype;
    var semestertype = req.query.semestertype;
    var grade = req.query.grade;
    var subject = req.query.subject;
    var publisher = req.query.publisher;
    var anstype = req.query.anstype;
   
    if (!limitStr)
        limit = 20;
    else
        limit = Number(limitStr);

    if (!pageStr)
        page = 1;
    else
        page = Number(pageStr);

    var filter = { school: { $nin: [sname] } };
    filter.grade = grade;
    filter.examtype = examtype;
    filter.subject = subject;
    /*if ($anstype == '3' || $anstype == '4' )//相同版本
	{
		$filter .= "AND publisher='".$publisher."' ";
	}

	if ($anstype == '2' || $anstype == '4' )//有題目和答案的試題
		$filter .= "AND valid=3 ";		*/
    if (anstype == 3 || anstype == 4) {
        filter.publisher = publisher;
    }
    if (anstype == 2 || anstype == 4) {
        filter.valid = '3';
    }

    if (semestertype =='1')
        filter.semester = { $regex: /1$/};
    else
        filter.semester = { $regex: /2$/ };
    switch (sidx) {
        case "semester":
            if (sord == 'asc')
                var sorter = { semester: 1 };
            else
                var sorter = { semester: -1 };
            break;
        case "school":
            if (sord == 'asc')
                var sorter = { school: 1 };
            else
                var sorter = { school: -1 };
            break;
        case "grade":
            if (sord == 'asc')
                var sorter = { grade: 1 };
            else
                var sorter = { grade: -1 };
            break;
        case "subject":
            if (sord == 'asc')
                var sorter = { subject: 1 };
            else
                var sorter = { subject: -1 };
            break;
        default:
            var sorter = {};
    }

    
    // Read test json examtype
    /*fs = require('fs')
    fs.readFile('./data/ref.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.send(data);
        res.end();
    });*/
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/twexam", function (err, db) {
        if (err) { return console.dir(err); }
        //$sql = "SELECT * FROM paper WHERE ".$filter." ORDER BY $sidx $sord LIMIT $start , $limit";
        //var filter = { sid: sid, level: level, semester: semester, grade: grade, subject: subject };
        //var filter = { sid: sid};
        db.collection('oldtest').find(filter).count(function (err, count) {
            if (err) { return console.log(err); }
            //{"records":"270","page":"1","total":14,"rows":[{"pno":"97950","semester":"1042","
            var total = Math.ceil(count / limit);

            var all = { records: count, page: page, total: total };
            var skipCount = (page - 1) * limit;

            db.collection('oldtest').find(filter).sort(sorter).skip(skipCount).limit(limit).toArray(function (err, docArray) {
                if (err) { return console.log(err); }
                all.rows = docArray;
                res.send(all);
                res.end();
                db.close();
            });
        });
    });

});

module.exports = router;
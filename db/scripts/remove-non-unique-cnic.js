const { Student } = require("../models/user");


function getRandomCNIC() {
    var minm = 1000000000000; //13 digits
    var maxm = 9999999999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

function addDashes(cnic) {
    return cnic.slice(0,5) + "-" + cnic.slice(5,12) + "-" + cnic[12]
    // 35201352016 2 3
    // 0123456789101112
}

async function removeNonUniqueCNICs() {
  const students = await Student.findAll()
  const used_cnics = []
  let i=0;
  let n = students.length;
  return new Promise(resolve=>{
    students.forEach(async (student)=>{
        if (!used_cnics.includes(student.cnic)) {
            used_cnics.push(student.cnic)
            i++
            if (i==n) resolve()
        } else {
            while (used_cnics.includes(student.cnic))  {
                student.cnic = addDashes(getRandomCNIC().toString())
            }
            await student.save()
            i++
            if (i==n) resolve()
        }

    })
  })
}

removeNonUniqueCNICs()
.then(()=>{
    console.log("done")
})
.catch(err=>{
    console.log(err)
})

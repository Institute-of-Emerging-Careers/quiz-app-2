const { Student } = require("../models/user");


function getRandomCNIC() {
    var minm = 1000000000000; //13 digits
    var maxm = 9999999999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
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
                student.cnic = getRandomCNIC()
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

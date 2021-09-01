exports.convertWeight = function (weightString){
  console.log(weightString.length)
  console.log(weightString)
  if (weightString === ""){
    return {
      weight: "",
      unit: ""
    }
  }
  let unit = weightString.match(/[a-z]/g)
    if(unit !== null){
      unit = unit.join("")
    }
    if(unit === null || unit.length === 0){
      return {
        weight: "",
        unit: ""
      }
    }

  let weight = weightString.replace(unit, "")



  if (unit === "lb" || unit === "lbs"){
    weight = weight * 453
  }
  if(unit ==="lbs"){
    unit = "lb"
  }

  if (unit === "oz"){
    weight = weight * 28.35
  }

  if (isNaN(weight)){
    return {
      weight: "",
      unit: ""
    }
  }

  return{
    weight: weight,
    unit: unit
  }
}
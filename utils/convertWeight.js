exports.convertWeight = function (weightString){
  if (weightString === ""){
    return {
      weight: "",
      unit: ""
    }
  }
  const unit = weightString.match(/[a-z]/g).join("")
  let weight = weightString.replace(unit, "")



  if (unit === "lb" || unit === "lbs"){
    weight = weight * 453
  }
  if(unit ==="lbs"){
    weight = "lb"
  }

  if (unit === "oz"){
    weight = weight * 28.35
  }

  return{
    weight: weight,
    unit: unit
  }
}
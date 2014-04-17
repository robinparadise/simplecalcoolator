// Robin Giles Ribera 2013

$(document).ready(function() {

  function isZero(str) {
    if (str === "0" || str === "") {
      return true;
    }
    return false;
  }

  function isEmpty(x) {
    if(x!=="" && x!==undefined) {
        return true;
    }
  }

  function factorial (n){
    j = 1;
    for(i=1;i<=n;i++){
      j = j*i;
    }
    return j;
  }

  function calc(n1, n2, op) {
    if (op === "+") {
      return Number(n1) + Number(n2);
    } 
    else if (op === "-") {
      return Number(n1) - Number(n2);
    }
    else if (op === "*") {
      return Number(n1) * Number(n2);
    }
    else if (op === "/") {
      return Number(n1) / Number(n2);
    }
    else if (op === "^") {
      return Math.pow(Number(n1), Number(n2));
    }
    else {
      return NaN;
    }
  }

  // Split into array removing delimiters [+ - * \ ^]
  function operationSplitOp(str) {
    return str.split(/[\+\-\*\/\^]/);
  } 
  // Split into array without removing delimiters [+ -]
  function operationSplitAdd(str) {
    return str.replace(/[\+]/g, "#+#").replace(/[\-]/g, "#-#").split("#");
  }
  // Split into array without removing delimiters [* /]
  function operationSplitMult(str) {
    return str.replace(/[\*]/g, "#*#").replace(/[\/]/g, "#/#").split("#");
  }
  // Split into array without removing delimiters [^]
  function operationSplitPow(str) {
    return str.replace(/[\^]/g, "#^#").split("#");
  }
  // Split into array without removing delimiters [+ - * \ ^]
  function operationSplitAll(str) {
    return str.replace(/[\+]/g, "#+#").replace(/[\-]/g, "#-#")
    .replace(/[\*]/g, "#*#").replace(/[\/]/g, "#/#")
    .replace(/[\^]/g, "#^#").split("#");
  }
  // Split into array replacing delimiters [¬ (-)]
  function operationSplitSign(str) {
    var array = operationSplitAll(str);
    var aux = [];
    array.forEach(function(entry) {
      if (entry[0] === "¬") {
        entry = entry.replace( "¬", "(-" ) + ")";
        entry = entry.replace( "!)", ")!" );
      }
      aux.push(entry);
    });
    return aux.join('');
  }
  // Replace Sign of the number and factorial
  function operationReplaceSign(str) {
    return str.replace(/[\¬]/g, "-").replace(/[\!]/, "");
  }
  // Replace Sign of the number
  function operationReplaceMinus(str) {
    return str.replace(/[\¬]/g, "-");
  }
  // Test is Last element of a array is Number
  function lastStrIsNumber(x) {
    var n = operationReplaceSign(x[x.length - 1])
    return !isNaN(Number(n));
  }
  function isLastFactorial(x) {
    var n = x[x.length - 1];
    if (n === '' || n === undefined) {
      return false
    }
    else if ( n.search(/[\!]/) >= 0 ) {
      return true;
    } else {
      return false;
    }
  }
  function hasDecimal(x) {
    var n = x[x.length - 1];
    if (n === '' || n === undefined) {
      return false
    }
    else if ( n.search(/[\.]/) >= 0 ) {
      return true;
    } else {
      return false;
    }
  }
  function greaterThanZero(str) {
    var n = Number(operationReplaceSign(str));
    if (n >= 0) { return true }
    else { return false }
  }

  // Split into two arrays: numbers & operators
  function extractOp(arr, del1, del2) {
    var operations = [];
    var array = [];
    arr.forEach(function(entry) {
      if (entry === del1 || entry === del2) {
        operations.push( entry );
      } else {
        array.push( entry );
      }
    });
    return {"arrayOp": array.splice(0), "operations": operations.splice(0)};
  }

  // Calc Factorial with function Factorial
  function calcFactorial(str) {
    if (!isLastFactorial(str)) { return str }

    str = str.replace("!", "");
    return factorial(Number(str));
  }

  // var array = ["1", "2", "3"];
  // var operations = ["^", "^"];
  function operationCalcPow(arr, op) {
    var array = arr.splice(0);
    var operations = op.splice(0);

    array = array.filter(isEmpty); // Clean
    if (array.length === operations.length) {
      operations.pop();
    }

    var number1 = array.shift();
    operations.forEach(function(entry) {
      var number2 = array.shift();
      number1 = calc(number2, number1, entry);
    });
    return number1;
  }


  // var array = ["1", "2", "3"];
  // var operations = ["+", "-", "*", "/"];
  function operationCalc(arr, op) {
    var array = arr.splice(0);
    var operations = op.splice(0);

    array = array.filter(isEmpty); // Clean
    if (array.length === operations.length) {
      operations.pop();
    }

    var number1 = array.shift();
    operations.forEach(function(entry) {
      var number2 = array.shift();
      number1 = calc(number1, number2, entry);
    });
    return number1;
  }



  function evalPow(opStr) {
    if ( Number( operationReplaceSign(opStr) ) && !isLastFactorial(opStr) ) {
      return operationReplaceSign(opStr);
    } else if (opStr === "-") {
      return "0";
    } 
    var arrayAll = operationSplitPow(opStr);
    var arrayOperations = extractOp(arrayAll, "^");

    // Signed
    var array = arrayOperations["arrayOp"].splice(0);
    for (var i=0; i<array.length; i++) {
      array[i] = operationReplaceMinus(array[i]);
      array[i] = calcFactorial(array[i]);
    }
    array.reverse();
    arrayOperations['operations'].reverse();
    return operationCalcPow(array, arrayOperations['operations']);
  }



  function evalMult(opStr) {
    if ( Number( operationReplaceSign(opStr) ) && !isLastFactorial(opStr) ) {
      return operationReplaceSign(opStr);
    } else if (opStr === "-") {
      return "0";
    } 
    var arrayAll = operationSplitMult(opStr);
    var arrayOperations = extractOp(arrayAll, "*", "/");

    // Pow
    var array = arrayOperations["arrayOp"].splice(0);
    for (var i=0; i<array.length; i++) {
      array[i] = evalPow(array[i]);
    }

    return operationCalc(array, arrayOperations['operations']);
  }

  function evalAdd(opStr) {
    if ( Number( operationReplaceSign(opStr) ) && !isLastFactorial(opStr) ) {
      return operationReplaceSign(opStr);
    } else if (opStr === "-") {
      return "0";
    }   
    var arrayAll = operationSplitAdd(opStr);
    var arrayOperations = extractOp(arrayAll, "+", "-");

    // Mult & Div
    var array = arrayOperations["arrayOp"].splice(0);
    for (var i=0; i<array.length; i++) {
      array[i] = evalMult(array[i]);
    }

    var aux = operationCalc(array, arrayOperations['operations']);
    return aux;
  }



  function printResult(opStr) {
    var result = evalAdd(opStr);
    if (opStr === "0" || opStr === "") {
      result = "0";
    }
    else if ( isNaN(Number(result)) || Math.abs(Number(result)) === Infinity ) {
      result = "ERROR";
    }
    //var result = eval( opStr );
    $('.screen').text(Math.ceil(result * Math.pow(10, 8)) / Math.pow(10,8));
    $(".outcome").text( operationSplitSign( $(".outcome").val() ) );
    return result;
  }

  function operatorBtn(e) {
    var digit = $(this).text();

    if ( isZero($(".outcome").text()) ) { return; }

    if ( !lastStrIsNumber( $(".outcome").val() ) ) {
      $('.clear').click();
    }

    $(".outcome").val( $(".outcome").val() + digit );
    $(".outcome").removeClass('result');
    // Show operations
    $(".outcome").text( operationSplitSign( $(".outcome").val() ) );
  }

  function powBtn(e) {
    var digit = "^";

    if ( isZero($(".outcome").text()) ) { return; }

    if ( !lastStrIsNumber( $(".outcome").val() ) ) {
      $('.clear').click();
    }

    $(".outcome").val( $(".outcome").val() + digit );
    $(".outcome").removeClass('result');
    // Show operations
    $(".outcome").text( operationSplitSign( $(".outcome").val() ) );
  }

  $(".operator").click(operatorBtn);
  $(".pow").click(powBtn);

  $(".number").click(function(e) {
    var digit = $(this).text();

    if ( isZero($(".outcome").text()) ) {
      $(".outcome").val('');
    }
    if ( $(".outcome").hasClass('result') ) { //Mode result
      $(".outcome").val( digit );
      $(".outcome").removeClass('result');
    }
    else if (isLastFactorial( $(".outcome").val() )) {
      var str = ( $(".outcome").val() + digit ).replace("!", "") + '!'
      $(".outcome").val( str );
    } else {
      $(".outcome").val( $(".outcome").val() + digit );
    }
    printResult($(".outcome").val());
  });

  $(".point").click(function(e) {
    var digit = $(this).text();
    var outcome = $(".outcome").val();
    var array = operationSplitOp( outcome );

    if (isZero(outcome)) {
      $(".outcome").val( '0' + digit );
      $(".outcome").removeClass('result');
    }
    else if ( lastStrIsNumber( outcome ) ) {
      if ( lastStrIsNumber(array) && !hasDecimal(array) ) {
        var str = (outcome + digit).replace("!.", ".!");
        $(".outcome").val(str);
        $(".outcome").removeClass('result');
      }
    }
    else if (!hasDecimal(array)) {
      $(".outcome").val( $(".outcome").val() + '0' + digit );
      $(".outcome").removeClass('result');
    }
    // Show operations
    $(".outcome").text( operationSplitSign( $(".outcome").val() ) );
    printResult($(".outcome").val());
  });

  function plusmnBtn(e) {
    if ( isZero($(".outcome").text()) ) { return; }
    var digit = "¬";
    var array = operationSplitAll( $(".outcome").val() )
    if ( lastStrIsNumber( array ) ) {
      if (greaterThanZero(array[array.length-1])) { // Change to negative
        array[array.length-1] = digit + array[array.length-1];
        $(".outcome").val( array.join('') );
      }
      else { // Change to positive
        array[array.length-1] = array[array.length-1].replace("¬","");
        $(".outcome").val( array.join('') );
      }
      $(".outcome").removeClass('result');
    }
    printResult($(".outcome").val());   
  }

  $(".plusmn").click(plusmnBtn);


  $('.solve').click(function(e) {
    var opStr = $(".outcome").val();
    var result = printResult(opStr);
    $(".outcome").val(result);
    $(".outcome").text(result);
    $(".outcome").addClass('result');
  });


  function clearC(e){
    var str = $(".outcome").val();
    str = str.substring(0, str.length - 1);
    $(".outcome").val(str);
    if ( $(".outcome").val() === "" ) {
      $(".outcome").val("0");
    } else if ( $(".outcome").val() === "ERRO" ) {
      $(".outcome").val("0");
    }
    printResult($(".outcome").val());
  }

  function allclear(e){
    $(".outcome").val('0');
    $(".outcome").text('0');
    $(".screen").text('0');
  }

  // clear field
  $(".clear").click(clearC);


  function piBtn(e) {
    var array = operationSplitAll( $(".outcome").val() ).filter(isEmpty);
    if ( isZero($(".outcome").text()) ) {
      $(".outcome").val( Math.PI.toFixed(6) );
      $(".outcome").removeClass('result');
      printResult($(".outcome").val());
    }
    else if ( !lastStrIsNumber( array ) ) {
      $(".outcome").val( $(".outcome").val() + Math.PI.toFixed(6) );
      $(".outcome").removeClass('result');
      printResult($(".outcome").val());
    }
  }

  function factorialBtn(e) {
    if ( isZero($(".outcome").text()) ) {
      $(".outcome").val("0!");
      printResult($(".outcome").val());
      return;
    }
    var array = operationSplitAll( $(".outcome").val() ).filter(isEmpty);
    if ( lastStrIsNumber( array ) && !isLastFactorial(array)) {
      $(".outcome").val( $(".outcome").val() + "!" );
      printResult($(".outcome").val());
    } else if (isLastFactorial(array)) {
      var str = $(".outcome").val().replace("!", "");
      $(".outcome").val( str );
      printResult($(".outcome").val());
    }
  }


  $('.shift').click(function() {
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');
      // active AC
      $('.clear').unbind();
      $('.clear').bind('click', allclear);
      $('.clear').text('AC');
      // active PI
      $('.pow').unbind();
      $('.pow').bind('click', piBtn);
      $('.pow').html('&Pi;');
      // active factorial
      $('.plusmn').unbind();
      $('.plusmn').bind('click', factorialBtn);
      $('.plusmn').html('!');
    }
    else {
      $(this).removeClass('active');
      // desactive AC
      $('.clear').unbind();
      $('.clear').bind('click', clearC);
      $('.clear').text('C');
      // desactive PI
      $('.pow').unbind();
      $('.pow').bind('click', powBtn);
      $('.pow').text('^');
      // desactive Factorial
      $('.plusmn').unbind();
      $('.plusmn').bind('click', plusmnBtn);
      $('.plusmn').html('&plusmn;');
    }
  });

  $(document).keydown(function(e) {
    //console.log("%%Down", e.which, String.fromCharCode(e.which));
    // Key Shift
    if (e.which === 16) {
      $('.pad .shift').removeClass('active');
      $('.pad .shift').click();
      return false;
    }
  });

  $(document).keypress(function(e) {
    //console.log("##Press", e.which, String.fromCharCode(e.which));
    var charC = String.fromCharCode(e.which);

    // key Enter & Space & =
    if (e.which === 13 || e.which === 32 || e.which === 61) {
      $('.solve').click();
      $('.output').addClass('active');
      setTimeout(function(){
        $('.output').removeClass('active');
      }, 1);
      return false;
    }
    // Key +
    else if (e.which === 43) {
      $('.pad > .plus').click();
      return false;
    }
    // Key *
    else if (e.which === 42 || e.which === 120 || e.which === 88) {
      $('.pad > .mult').click();
      return false;
    }
    // Key /
    else if (e.which === 47) {
      $('.pad > .divide').click();
      return false;
    }
    // Key ^ E e
    else if (e.which === 46) {
      $('.pad > .point').click();
      return false;
    }
    // Key ^ E e
    else if (e.which === 94 || e.which === 69 || e.which === 101) {
      powBtn();
      return false;
    }
    // Key < >
    else if (e.which === 60 || e.which === 62) {
      plusmnBtn();
      return false;
    }
    // Key P p
    else if (e.which === 80 || e.which === 112) {
      piBtn();
      return false;
    }
    // Key P p
    else if (e.which === 33) {
      factorialBtn();
      return false;
    }
    // key backspace & Supr or Del
    if (e.which === 99 || e.which === 67) {
      clearC();
    }
    try { // Key Numbers
      if ($(".pad > ." + charC).length > 0) {
        $(".pad > ." + charC).click();
        return false;
      }
    }
    catch (ex) { return; }
  });

  $(document).keyup(function(e) {
    //console.log(">>UP", e.which, String.fromCharCode(e.which));
    // key backspace & Supr or Del
    if (e.which === 8 || e.which === 46) {
      clearC();
    }
    // key Esc
    else if (e.which === 27) {
      allclear();
    }

    // Key Shift
    else if (e.which === 16) {
      $('.pad .shift').addClass('active');
      $('.pad .shift').click();
      return false;
    }
    return false;
  });

});
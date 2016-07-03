/*main.js 2016-04-07*/
var khshools = JSON.parse(khschools_json);
    //debugger;

$(function(){
   //$("#schooldd").append('<option value="aaa">bbbbb</option>');
  //alert(khregions.length.toString());

  for (var i = 0; i < khregions.length; i++) {
      var rrr = khregions[i];
      var yyy = '<option value="'+rrr+'">'+rrr+'</option>';
      $("#khregion1").append(yyy);
      $("#khregion2").append(yyy);
  }
  //alert(khshools.length.toString());
  var arrX=[];
    for (var i = 0; i < khshools.length; i++) {
        
      var nnn = khshools[i]["schname"];
      var level = khshools[i]["level"];
      var region = khshools[i]["region"];
      var sno = i.toString();
      var yyy = '<option value="'+sno+'">'+nnn+'</option>';

      var sid = khshools[i]["sid"];
      var skey = region+'-'+nnn;
      var sval = region+'-'+nnn+'('+sid+')';
      var keyobj = {"label":skey, "value":sval}
      arrX.push(keyobj);
      if (level=="\u570b\u4e2d")//國中
        $("#khschool1").append(yyy);
      else
        $("#khschool2").append(yyy);
  }
  //alert("arrX"+arrX.length.toString());
  $('#khgo0').prop('disabled', true);
  $('#khgo1').prop('disabled', true);
  $('#khgo2').prop('disabled', true);
  $("#khgo0").click(function(){
      
      var sss = $("#khschool0").val();
      var p1=  sss.indexOf("(")+1;
      var p2=  sss.indexOf(")", p1);
      var sid = sss.substring(p1, p2);
      var url = '/'+sid+'/exams';
      //alert(url);
      window.location = url;
  });
  $( "#khschool0" ).autocomplete({
    source:arrX,
    response: function( event, ui ) {
      $('#khgo0').prop('disabled', false);
    }
  });
  $("#khschool0" ).change(function() {
    var sss = $("#khschool0").val();
      var p1=  sss.indexOf("(")+1;
      if (p1<=0)
      {
        $('#khgo0').prop('disabled', true);
      }
      else
      {
        $('#khgo0').prop('disabled', false);
      }
  });
  $("#khgo1").click(function(){
      
      var ii = $("#khschool1").val();
      var i= parseInt(ii);
      if (i== NaN || i==0)
      {
        alert("請選取學校");
        return;
      }
      var sid = khshools[i]["sid"];
      var url = '/'+sid+'/exams';
      window.location = url;
  });
  $("#khregion1" ).change(function() {
    //alert("Change");
    var selregion = $("#khregion1").val();
    //alert(selregion);
    $("#khschool1 option").remove();
    for (var i = 0; i < khshools.length; i++) {
        var nnn = khshools[i]["schname"];
        var level = khshools[i]["level"];
        var region = khshools[i]["region"];
        if (selregion !="All" && selregion != region)
          continue;
        var yyy = '<option value="'+i.toString()+'">'+nnn+'</option>';
        if (level=="\u570b\u4e2d")//國中
          $("#khschool1").append(yyy);
    }
    $("#khschool1 option:first").attr('selected','selected');
    $('#khgo1').prop('disabled', false);
  });
  $("#khschool1" ).change(function() {
    //alert("Change");
    var ii = $("#khschool1").val();
    var i= parseInt(ii);
      if (i== NaN || i==0)
      {
        $('#khgo1').prop('disabled', true);
      }
      else
      {
        $('#khgo1').prop('disabled', false);
      }
  });
  $("#khgo2").click(function(){
      
      var ii = $("#khschool2").val();
      var i= parseInt(ii);
      if (i== NaN || i==0)
      {
        alert("請選取學校");
        return;
      }
      var sid = khshools[i]["sid"];
      var url = '/'+sid+'/exams';
      //alert(url);
      window.location = url;
  });
  $("#khregion2" ).change(function() {
    //alert("Change");
    var selregion = $("#khregion2").val();
    //alert(selregion);
    $("#khschool2 option").remove();
    for (var i = 0; i < khshools.length; i++) {
        var nnn = khshools[i]["schname"];
        var level = khshools[i]["level"];
        var region = khshools[i]["region"];
        if (selregion !="All" && selregion != region)
          continue;
        var yyy = '<option value="'+i.toString()+'">'+nnn+'</option>';
        if (level=="\u570b\u5c0f")//國小
          $("#khschool2").append(yyy);
    }
    $("#khschool2 option:first").attr('selected','selected');
    $('#khgo2').prop('disabled', false);
  });
  $("#khschool2" ).change(function() {
    //alert("Change");
    var ii = $("#khschool2").val();
    var i= parseInt(ii);
      if (i== NaN || i==0)
      {
        $('#khgo2').prop('disabled', true);
      }
      else
      {
        $('#khgo2').prop('disabled', false);
      }
  });
});
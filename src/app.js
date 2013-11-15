$(document).ready(function() {
    $("input").on("change", function(e) {
      getTotals();
    });

    $('.proceed').click(function(e) {
      var id = $(this).attr("href");

      $('html, body').animate({
        scrollTop: $(id).offset().top
      }, 1000);
      return false;
    });

    $("[type='range']").change(function(e) {
      $(this).siblings('span').html($(this).val() + " hours");
    })

    $('header').css("height", $(window).height());

    $('#sidebar').affix({
      offset: {
        top: $('header').height()
      }
    });

    $("[data-activate]").each(function() {
      var id = $(this).data("activate");

      $("#" + id).on("change", function(e) {
        if($(this).prop("checked")) {
          $('[data-activate="'+id+'"]').prop("disabled", false);
        } else {
          $('[data-activate="'+id+'"]').prop("disabled", true);
        }
      });
    })

    $("[for]").each(function() {
      var id = $(this).attr("for");
    });

    $("[data-switch]").each(function() {
      var ul = $(this);
      var id = ul.data("switch");

      $('[name="'+id+'"]').click(function(e) {
        var val = $(this).val();

        ul.find("> li").hide();
        ul.find("> li." + val).show();
      });
    });

    $("[data-sum]").each(function() {
      var addends, sum, sum_el;
      
      addends = $(this).data("sum").split("+");
      sum_el = this;
      $(this).html("0");

      addends.forEach(function(addend) {
        $("#" + addend).on("change", function() {
          sum = 0;

          addends.forEach(function(addend) {
            var value = $("#" + addend).prop("disabled") ?
            0 : $("#" + addend).val();
            sum += parseFloat(value);
            $(sum_el).html(sum.toString());
          });

          getTotals();
        });
      });
    });

    $("[data-aggregate]").each(function() {
      var aggregation = this;
      var target_id = $(this).data("aggregate");

      $("#" + target_id).find("input[type='checkbox']").on("change", function() {
        var new_html = "";
        $(aggregation).html(new_html);

        $("#" + target_id).find("input[type='checkbox']").each(function () {
          if($(this).prop("checked")) {
            new_html += "<li>" + $(this).siblings("label").first().html() + "</li>";
          }
        });

        $(aggregation).html(new_html);
        showTextResults();
      });
    });
});

function getTotals() {
  $("[data-hour-total]").each(function() {
    var afterei = parseFloat($(this).siblings("td[data-sum^='afterei']").html());
    var iep = parseFloat($(this).siblings("td[data-sum^='school']").html());

    if(isNaN(afterei)) afterei = 0;
    if(isNaN(iep)) iep = 0;

    $(this).html(afterei + iep);
  });

  $("[data-total]").each(function() {
    var el = this;
    var className = $(this).data("total");
    var sum = 0;

    $("." + className).not(".ignore").each(function() {
      var value = parseFloat($(this).html());

      if(!isNaN(value)) {
        sum += parseFloat(value);
      }
    });

    $(el).html(sum);
  });

  showTextResults();
}

function showTextResults() {
  var current = parseFloat($('[data-total="current"]').html());
  var future = parseFloat($('[data-total="future"]').html());
  var iep = parseFloat($('[data-total="iep"]').html());

  var grand_total = current + future;
  // console.log(current, iep, future, grand_total);

  $(".text-results > p").hide();

  if($("#ei-music-hours").val() > 0) {
    $(".sophia-hates-music").show();
  }

  if(current > future) {
    if(iep === 0) {
      $(".no-iep").show();
    } else {
      $(".decreasing").show();
    }
  }

  if(current === future) {
    if(grand_total < 20) {
      $(".could-improve").show();
    }
  }

  if(current < future) {
    $(".huzzah").show();
  }

  var snap = $("#support-snap").prop("checked");
  var wic = $("#support-wic").prop("checked");
  var dds = $("#support-dds").prop("checked");

  if(wic && !snap) {
    $(".wic-not-snap").show();
  }

  if(snap && !wic) {
    $(".snap-not-wic").show();
  }

  if(snap && wic) {
    $(".wic-and-snap").show();
  }

  if(!dds) {
    $(".no-dds").show();
  }

  var rec = $("#community-recreation").prop("checked");
  var supports = $("#community-support-group").prop("checked");
  var parents = $("#community-parent-to-parent").prop("checked");
  var groups = $("#community-parent-group").prop("checked");
  var religious = $("#community-religious").prop("checked");

  if(religious) {
    $('.religious').show();
  }

  if(!rec) {
    $('.no-rec-program').show();
  }

  if(!supports && !parents && !groups) {
    $('.no-supports-parents-groups').show();
  }

  var iep = $("#iep-dont-know").prop("checked");

  if(iep) {
    $(".iep-dont-know").show();
  }
}
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

      $("#" + id).on("change", function(e,f,b) {
        if($(this).prop("checked")) {
          $('[for="'+id+'"]').css("opacity", 1);
        } else {
          $('[for="'+id+'"]').css("opacity", 0.5);
        }
      });
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
            sum += parseInt(value, 10);
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
    var afterei = parseInt($(this).siblings("td[data-sum^='afterei']").html(),10);
    var iep = parseInt($(this).siblings("td[data-sum^='school']").html(),10);

    if(isNaN(afterei)) afterei = 0;
    if(isNaN(iep)) iep = 0;

    $(this).html(afterei + iep);
  });

  $("[data-total]").each(function() {
    var el = this;
    var className = $(this).data("total");
    var sum = 0;

    $("." + className).not(".ignore").each(function() {
      var value = parseInt($(this).html(), 10);

      if(!isNaN(value)) {
        sum += parseInt(value, 10);        
      }
    });

    $(el).html(sum);
  });

  var current_total = parseInt($('[data-total="current"]').html(),10);
  var future_total = parseInt($('[data-total="future"]').html(),10);
  var iep_total = parseInt($('[data-total="iep"]').html(),10);

  showTextResults(current_total, future_total, iep_total);
}

function showTextResults(current, iep, future) {
  var grand_total = current + future;
  // console.log(current, iep, future, grand_total);

  $(".text-results p").hide();

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
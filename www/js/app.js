$(function() {
    var map;
  // 「スキャンする」を押したときのイベント
  $("#StartButton").click(function() {
    $.ajax({url: serverUrl + api.startCaptureById + "?id=" + agentID, success: function(result){
        getAgentState();
    }});   
   
  });
  
  $("#StopButton").click(function() {
    $.ajax({url: serverUrl + api.stopCaptureById + "?id=" + agentID, success: function(result){
        getAgentState();
    }});  
  
  });
  
    $("#PauseButton").click(function() {
    $.ajax({url: serverUrl + api.pauseCaptureById + "?id=" + agentID, success: function(result){
            getAgentState();
        }});  
  
    });
    
    $("#ResumeButton").click(function() {
    $.ajax({url: serverUrl + api.resumeCaptureById + "?id=" + agentID, success: function(result){
            getAgentState();
        }});  
  
    });
  
  $("#RescanQRCode").click(function() {
      if(agentStatus == "Online" || agentStatus == "Shutdown" || agentStatus == ""){
        scanBarcode();
      }
    return false;
  });
  
   function scanBarcode() {
      // BarcodeScannerプラグインを利用してスキャン
      window.plugins.barcodeScanner.scan(
        // 成功時に実行されるコールバック（キャンセル時も含む）
        function(result) {
          // キャンセルされたら何もしない
            if (result.cancelled) {
                return;
            }
            //qrcode JSON string sample: {"id": 85,"scenesNum": 1,"scenesName": "咬我阿"}
            qrCodeText = JSON.parse(result.text);
            if(!qrCodeText.id || !qrCodeText.scenesNum){
                return;
            }
            agentID = qrCodeText.id;
            qrCodeTextApi = "?id=" + qrCodeText.id + "&scenesNum=" + qrCodeText.scenesNum;
            console.log(serverUrl + api.changeScenesById + qrCodeTextApi);
            $.ajax({url: serverUrl + api.changeScenesById + qrCodeTextApi, success: function(result){
                // alert(JSON.parse(result).info)
                if(JSON.parse(result).info == "SUCCESS"){
                    themName = qrCodeText.scenesName;
                    $('#agentThemeLabel').text("場景為: " + themName);
                }
                else{
                    themName = "預設";
                    $('#agentThemeLabel').text("場景為: " + themName);
                }
                getAgentState();
            }});      
        },
        // エラー時に実行されるコールバック
        function(error) {

        }
      );
    }
    
    function getAgentState() {
        $.ajax({url: serverUrl + api.agentSearchById + "?id=" + agentID , success: function(result){
            agentStatus = JSON.parse(result).data[0].status;
            agentName = JSON.parse(result).data[0].name;
            $('#agentStatusLabel').text(agentStatus);
            switch(agentStatus) {
                case "Online":
                    $("#StartButton").css('color', '#4caf50');
                    $("#StopButton").css('color', 'gray'); 
                    $("#PauseButton").css('color', 'gray');
                    $("#ResumeButton").css('color', 'gray');
                    $("#RescanQRCode").css('color', 'black');
                    
                    $("#StartButton").show();
                    $("#ResumeButton").hide();
                    break;
                case "Shutdown":
                    $("#StartButton").css('color', 'gray');
                    $("#StopButton").css('color', 'gray'); 
                    $("#PauseButton").css('color', 'gray');
                    $("#ResumeButton").css('color', 'gray');
                    $("#RescanQRCode").css('color', 'black');
                    
                    $("#ResumeButton").hide();                   
                    break;
                case "Capturing":
                    $("#StartButton").css('color', 'gray');
                    $("#StopButton").css('color', '#FF4081'); 
                    $("#PauseButton").css('color', '#FF9100');
                    $("#ResumeButton").css('color', 'gray');
                    $("#RescanQRCode").css('color', 'gray');
                    
                    $("#StartButton").show();
                    $("#ResumeButton").hide();                   
                    break;
                case "Pause":
                    $("#StartButton").css('color', 'gray');
                    $("#StopButton").css('color', '#FF4081'); 
                    $("#PauseButton").css('color', 'gray');
                    $("#ResumeButton").css('color', '#4caf50');
                    $("#RescanQRCode").css('color', 'gray');
                    
                    $("#ResumeButton").show();
                    $("#StartButton").hide();                    
                    break;    
                default:
                    $("#StartButton").css('color', 'gray');
                    $("#StopButton").css('color', 'gray'); 
                    $("#PauseButton").css('color', 'gray');
                    $("#ResumeButton").css('color', 'gray');
                    $("#RescanQRCode").css('color', 'black');
                    
                    $("#ResumeButton").hide();
                    break;
            }
        }
        ,error: function(error) {
            console.log(error);
        }
        });  
    }
});

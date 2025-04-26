
//移動指示時に発生する内部処理
function Move_ivent_before(gameManagement){
    gameManagement.map_passed(gameManagement.player_position);
}

// 移動終了後に発生する内部処理
function Move_ivent_after(gameManagement){
    let gm = gameManagement;
    if(gm.map.goal.x == gm.player_position.x && gm.map.goal.y == gm.player_position.y && gm.gameprogress() > 80){
        alert("あなたは十分な調査結果を持って生還することに成功した。次の任務も期待されているぞ……");
    }else if(gm.map.goal.x == gm.player_position.x && gm.map.goal.y == gm.player_position.y){
        alert("調査結果が足りないと怒られてしまった。もう少し探索してみよう……");
    }

    let res = chk_click_position(gm.map.mine_list);
    if(res != undefined){
        alert("モンスターが襲いかかってきた！" + res.danger + "のダメージ。");
        gm.player_info.hp -= res.danger;
        if(gm.player_info.hp < 0){
            alert("ゲームオーバーです。");
            UIdraw(gm);
            gm.sceneflag = 'dead';
        }
    }
}

function chk_click_position(list){
    var res = list.find(function(value, index, array){
        return (value.x === gameManagement.player_position.x && value.y === gameManagement.player_position.y);
    });

    return res;
}
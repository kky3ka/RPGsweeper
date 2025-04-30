// 初期化時に発生する内部処理
function Init_Event(gameManagement){
    let gm = gameManagement;

    // 初期位置の場所を踏破済みにする
    gm.map.checked_map = map_passed(gm.player_position, gm.map.field_passed, 0);
    gm.gameprogress = gameprogress(gm.map);

}

//移動指示時に発生する内部処理
function Move_Event_before(gameManagement){
    let gm = gameManagement;

    // 踏破済みマップを更新
    gm.map.checked_map = map_passed(gm.player_position, gm.map.field_passed, 0);
}

// 移動終了後に発生する内部処理
function Move_Event_after(gameManagement){
    let gm = gameManagement;
    if(gm.map.goal.x == gm.player_position.x && gm.map.goal.y == gm.player_position.y && gm.gameprogress> 80){
        alert("あなたは十分な調査結果を持って生還することに成功した。次の任務も期待されているぞ……");
    }else if(gm.map.goal.x == gm.player_position.x && gm.map.goal.y == gm.player_position.y){
        alert("調査結果が足りないと怒られてしまった。もう少し探索してみよう……");
    }

    // 現在位置をチェック、戦闘が発生した場合
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
    // 現在位置をチェック、アイテムを取得した
    //Todo

    // 踏破率を更新
    gm.gameprogress = gameprogress(gm.map);
}

/**
 * 
 * @param {*} list マップ位置
 * @returns 
 */
function chk_click_position(list){
    var res = list.find(function(value, index, array){
        return (value.x === gameManagement.player_position.x && value.y === gameManagement.player_position.y);
    });

    return res;
}

/**
 * 踏破したマップ位置を記録
 * @param {*} player_position 
 * @param {map} player_passed_map 
 * @param {int} range               反映範囲　0=キャラのいるマスのみ　1=キャラのいるマス＋1（周囲6マス分）
 */
function map_passed(player_position, player_passed_map, range){
    for(var i = player_position.y - range; i <= player_position.y + range; i++){
        for(var j = player_position.x - range; j <= player_position.x + range; j++){
            if(player_passed_map[i][j] != 1){
                player_passed_map[i][j] = 1;
            }
        }
    }
}

/**
 * 操作進度を計算
 * @param {*} map 
 * @returns 
 */
function gameprogress(map){
    let flatarr = map.field_passed.flat(2);
    var checked_map = 0;
    for(var i = 0; i < flatarr.length; i++){
        if(flatarr[i] == 1){
            checked_map++;
        } 
    }
    let mapsize = map.size.x * map.size.y;

    return Math.round(checked_map / mapsize * 100) ;
}
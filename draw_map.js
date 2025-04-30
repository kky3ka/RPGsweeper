// マップの描画
function Mapdraw(gm){
    arr = gm.map.distribution;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // 画像サイズからCanvasサイズを算出
    const maptilesize = 60;
    canvas.width = 360;  // 5*maptilesize*(maptilesize/2)*2
    canvas.height = 360;

    function maprange(player_position, mapsize){
    // プレイヤーの周囲（2マス先まで）のマスを描画
    // 描画内容の開始位置を設定
        let mapstart = player_position - 3;
        let mapend = player_position + 4;
        if(mapstart < 0){
            mapend = player_position + 4 + Math.abs(mapstart);
            mapstart = 0;
        }
        if(mapend > mapsize){
            mapstart = mapstart - Math.abs(mapend - mapsize);
            mapend = mapsize;
        }
        return {
            start:mapstart, end:mapend
        };
    }
        
    function drawstart_pos(drawrange){
        // 描画開始位置を設定
        let drawstart = { x: Math.max(drawrange.x.start * maptilesize, 0) +maptilesize/2,
                        y: Math.max(drawrange.y.start * maptilesize, 0) +maptilesize/2 };
        //プレイヤー位置が端に近かったときに描画位置をずらす処理
        if(gm.player_position.x <= 2){
            drawstart.x -= maptilesize;
        }
        if(gm.player_position.x >= arr[0].length - 3){
            drawstart.x += maptilesize;
        }
        if(gm.player_position.y <= 2){
            drawstart.y -= maptilesize;
        }
        if(gm.player_position.y >= arr.length - 3){
            drawstart.y += maptilesize;
        }
        return drawstart;
    }

    let drawrange = {x:maprange(gm.player_position.x, arr[0].length),
                        y:maprange(gm.player_position.y, arr.length)};
    let drawstart = drawstart_pos(drawrange);

    draw_maptile(drawrange, drawstart, maptilesize, ctx, gm)
}

// マップタイルの描画
function draw_maptile(drawrange, drawstart, maptilesize, ctx, gm){
    mine = gm.map.mine_list;

    for (let i = drawrange.y.start; i < drawrange.y.end; i++) {
        for (let j = drawrange.x.start; j < drawrange.x.end; j++) {
            const value = arr[i][j];
            
            // 通常マップタイル
            // 地面ベースカラー
            if(gm.map.field_passed[i][j] == 1){
                ctx.fillStyle = "lightgreen";
            }
            // キャラ周辺の移動範囲
            if((i - 1 <= gm.player_position.y && gm.player_position.y <= i + 1 ) &&
                (j - 1 <= gm.player_position.x && gm.player_position.x <= j + 1 )
                ){
                ctx.fillStyle ='rgb(183, 226, 165)';
                
            }
            // ゴール位置
            if(i == gm.map.goal.y && j == gm.map.goal.x){
                ctx.fillStyle = "red";
            }
            ctx.fillRect((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, maptilesize, maptilesize);

            // 現在のキャラクター位置付近の描画
            if(gm.map.field_passed[i][j] == 1 || (i == gm.player_position.y && j == gm.player_position.x)){
                let pl_around = [
                    [ 0, 0, 0 ],
                    [ 0, arr[i][j], 0],
                    [ 0, 0, 0 ]
                ];
                (i > 0 && j > 0)                                 ? pl_around[0][0] = arr[i-1][j-1] : 0;
                (i > 0)                                          ? pl_around[0][1] = arr[i-1][j] : 0;
                (i > 0 && j < drawrange.x.end-1)                 ? pl_around[0][2] = arr[i-1][j+1] : 0;
                (j > 0)                                          ? pl_around[1][0] = arr[i][j-1] : 0;
                (j < drawrange.x.end-1)                          ? pl_around[1][2] = arr[i][j+1] : 0;
                (i < drawrange.y.end-1 && j > 0)                 ? pl_around[2][0] = arr[i+1][j-1] : 0;
                (i < drawrange.y.end-1)                          ? pl_around[2][1] = arr[i+1][j] : 0;
                (i < drawrange.y.end-1 && j < drawrange.x.end-1) ? pl_around[2][2] = arr[i+1][j+1] : 0;
                
                // マップタイル画像の描画
                if(value >= 20){
                    draw_maptile_grass((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, ctx, pl_around);
                }
                if(value >= 40){
                    draw_maptile_grass_dark((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, ctx, pl_around);
                }
                if(value >= 60){
                    draw_maptile_shige((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, ctx, pl_around);
                }

                // ゴール位置
                if(i == gm.map.goal.y && j == gm.map.goal.x){
                    ctx.fillStyle = "red";
                }

                // キャラクター位置の描画
                var res = mine.some(function(value, index, array){
                return (value.x === j && value.y === i);
                });
                if(res){
                    draw_character_enemy((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, ctx);
                }
            }
            // 影など演出
            if(i == gm.player_position.y && j == gm.player_position.x){
                //現在のプレイヤー位置
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fillRect((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, maptilesize, maptilesize);
            }else if(gm.map.field_passed[i][j] != 1){
                //プレイヤーの検知範囲外
                ctx.fillStyle = "rgba(0,0,0,0.25)";
                ctx.fillRect((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, maptilesize, maptilesize);
            }
        }
    }
}

function draw_darkness(pos_x, pos_y, ctx){
    ctx.fillRect((j * maptilesize) - drawstart.x, (i * maptilesize) -drawstart.y, maptilesize, maptilesize);
}
function draw_character_enemy(pos_x, pos_y, ctx){
    ctx.drawImage(enemy, 0, 0, 60, 60, pos_x, pos_y, 60, 60);
}

function draw_maptile_shige(pos_x, pos_y, ctx){
    ctx.drawImage(shige, 0, 0, 60, 60, pos_x, pos_y, 60, 60);
}

function draw_maptile_grass(pos_x, pos_y, ctx, around){
    draw_maptile_autotile(pos_x, pos_y, ctx, around, grass, 20);
}

function draw_maptile_grass_dark(pos_x, pos_y, ctx, around){
    draw_maptile_autotile(pos_x, pos_y, ctx, around, grass_dark, 40);
}

//自動描画タイルの設定
function draw_maptile_autotile(pos_x, pos_y, ctx, around, tilechip, val){
    if(around[0][1] >= val && around[1][0] >= val && around[2][1] >= val && around[1][2] >= val){
        ctx.drawImage(tilechip, 30, 30, 60, 60, pos_x, pos_y, 60, 60);
    }else if(around[0][1] < val && around[1][0] < val && around[1][2] < val){
    // 隣接が下のマスとだけ
        ctx.drawImage(tilechip, 0, 0, 30, 60, pos_x, pos_y, 30, 60);
        ctx.drawImage(tilechip, 90, 0, 30, 60, pos_x + 30, pos_y, 30, 60);
    }else if( around[1][2] < val && around[0][1] < val && around[2][1] < val){
    // 左とだけ
        ctx.drawImage(tilechip, 60, 0, 60, 30, pos_x, pos_y, 60, 30);
        ctx.drawImage(tilechip, 60, 90, 60, 30, pos_x , pos_y + 30, 60, 30);
    }else if( around[0][1] < val && around[1][0] < val && around[2][1] < val){
    // 右とだけ
        ctx.drawImage(tilechip, 0, 0, 60, 30, pos_x, pos_y, 60, 30);
        ctx.drawImage(tilechip, 0, 90, 60, 30, pos_x, pos_y + 30, 60, 30);
    }else if( around[1][0] < val && around[2][1] < val && around[1][2] < val){
    // 上とだけ
        ctx.drawImage(tilechip, 0, 60, 30, 60, pos_x, pos_y, 30, 60);
        ctx.drawImage(tilechip, 90, 60, 30, 60, pos_x + 30, pos_y, 30, 60);
    }else if(around[0][1] < val && around[1][0] < val ){    
    //左上角                
        ctx.drawImage(tilechip, 0, 0, 60, 60, pos_x, pos_y, 60, 60);
    }else if( around[1][2] < val && around[0][1] < val ){
    //右上角                  
        ctx.drawImage(tilechip, 60, 0, 60, 60, pos_x, pos_y, 60, 60);
    }else if( around[1][0] < val && around[2][1] < val ){
    // 左下角                    
        ctx.drawImage(tilechip, 0, 60, 60, 60, pos_x, pos_y, 60, 60);  
    }else if( around[2][1] < val && around[1][2] < val ){
    // 右下角                    
        ctx.drawImage(tilechip, 60, 60, 60, 60, pos_x, pos_y, 60, 60);
    }else if( around[1][0] < val && around[1][2] < val){
    // 一本道　上下と隣接
        ctx.drawImage(tilechip, 0, 30, 30, 60, pos_x, pos_y, 30, 60);
        ctx.drawImage(tilechip, 90, 30, 30, 60, pos_x + 30, pos_y, 30, 60);
    }else if( around[0][1] < val && around[2][1] < val){
    // 一本道　左右と隣接
        ctx.drawImage(tilechip, 30, 0, 60, 30, pos_x, pos_y, 60, 30);
        ctx.drawImage(tilechip, 30, 90, 60, 30, pos_x, pos_y + 30, 60, 30);
    }else if( around[0][1] < val){
    // 上
        ctx.drawImage(tilechip, 30, 0, 60, 60, pos_x, pos_y, 60, 60);
    }else if( around[2][1] < val){
    // 下
        ctx.drawImage(tilechip, 30, 60, 60, 60, pos_x, pos_y, 60, 60);
    }else if( around[1][0] < val){
    // 左
        ctx.drawImage(tilechip, 0, 30, 60, 60, pos_x, pos_y, 60, 60);
    }else if( around[1][2] < val){
    // 右
        ctx.drawImage(tilechip, 60, 30, 60, 60, pos_x, pos_y, 60, 60);
    }else{
        ctx.drawImage(tilechip, 0, 0, 30, 30, pos_x, pos_y, 30, 30);
        ctx.drawImage(tilechip, 90, 0, 30, 30, pos_x + 30, pos_y, 30, 30);
        ctx.drawImage(tilechip, 0, 90, 30, 30, pos_x, pos_y + 30, 30, 30);
        ctx.drawImage(tilechip, 90, 90, 30, 30, pos_x + 30, pos_y + 30, 30, 30);
    }
}

//UI関連描画
function UIdraw(gm){
    const page_hp = document.getElementById('HP');
    const page_progress = document.getElementById('progress');

    page_hp.textContent = "HP:" + gm.player_info.hp;
    page_progress.textContent = "調査進捗:" + gm.gameprogress + "%";
}
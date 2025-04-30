
class Map {
    genelate_list(map_size, event, difficulity_range){
        // 引数：マップの広さ（二次元配列のサイズ）、マップ内のイベント数、危険度幅
        // 戻り値：敵出現位置リスト
        let map_array = new Array(event);
        
        for(let i = 0;  i < event; i++){
            let x = Math.floor(Math.random() * (map_size.x));
            let y = Math.floor(Math.random() * (map_size.y));
            let danger = Math.floor(Math.random() * (difficulity_range.max - difficulity_range.min)) + difficulity_range.min;
            map_array[i] = {x:x, y:y, danger:danger};
        }
        return map_array;
    }
    genelate_distribution(map_size, map_miner){
        // 引数：エネミーマップ
        // 戻り値：危険度分布
        let map_distribution = this.map_init(map_size);

        // マスの危険度決定
        map_distribution = this.calc_dangerlate(map_distribution, map_miner, 2);
        map_distribution = this.calc_dangerlate(map_distribution, map_miner);

        return map_distribution;
    }

    calc_dangerlate(board, miner, field=1){
        let events_count = miner.length - 1;
        while( events_count >= 0){
            let x = miner[events_count].x;
            let y = miner[events_count].y;
            let danger = miner[events_count].danger;

            for (let i = Math.max(y-field, 0); i < Math.min(y+(field + 1), board.length); i++) {
                for (let j = Math.max(x-field, 0); j < Math.min(x+(field + 1), board[0].length); j++) {
                    board[i][j] = board[i][j] + (danger / (field * 2));
                }
            }
            events_count--;
        }
        return board;
    }

    set_random_point (map_size, mine_list){
        // 位置をランダムに決定　地雷のある場所は選ばれない
        let x, y;
        do {
            x = Math.floor(Math.random() * (map_size.x));
            y = Math.floor(Math.random() * (map_size.y));

            var res = mine_list.some(function(value, index, array){
                return (value.x === x && value.y === y);
            });
        } while(res == true);
        
        return {x:x, y:y};
    }

    set_random_point_all (map_size){
        // 位置をランダムに決定　すべての場所から
        let x, y;

        x = Math.floor(Math.random() * (map_size.x));
        y = Math.floor(Math.random() * (map_size.y));
        
        return {x:x, y:y};
    }

    set_goal_point (map_size, mine_list, start_point){
        // ゴール位置を決定　スタート位置と地雷のある場所は選ばれない
        let goal;
        do {
            goal = this.set_random_point(map_size, mine_list);
        }while(start_point.x == goal.x && start_point.y == goal.y);

        return goal;
    }

    map_init(map_size){
        // 空状態のマップを作成
        let map_row = map_size.x;
        let map_col = map_size.y;

        let map_emp = new Array(map_col);
        for(let i = 0; i < map_emp.length; i++){
            map_emp[i] = new Array(map_row).fill(0);
        }
        return map_emp;
    }

    constructor(map_size, event, difficulity_range){
        this.size = map_size;
        this.mine_list = this.genelate_list(this.size, event, difficulity_range);
        this.distribution = this.genelate_distribution(this.size, this.mine_list);
        this.field_passed = this.map_init(this.size);
        this.start = this.set_random_point(this.size, this.mine_list);
        this.goal = this.set_goal_point(this.size, this.mine_list, this.start);
    }
}
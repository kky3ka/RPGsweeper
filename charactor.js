
class Equipment {
    constructor(weapon = null, armor = null, accessory = null){
        this.weapon = weapon;
        this.armor = armor;
        this.accessory = accessory;
    }
    equip_weapon(weapon){
        this.weapon = weapon;
    }
    unequip_weapon(){
        this.weapon = null;
    }
    equip_armor(armor){
        this.armor = armor;
    }
    unequip_armor(){
        this.armor = null;
    }
    equip_accessory(accessory){
        this.accessory = accessory;
    }
    unequip_accesory(){
        this.accessory = null;
    }
}

class Character {
    constructor(name, max_hp, max_mp, attack, defense, luck, weapon, armor, accessory) {
        this.name = name;
        this.hp = max_hp;
        this.max_hp = max_hp;
        this.mp = max_mp;
        this.max_mp = max_mp;
        this.attack = attack;
        this.defense = defense;
        this.luck = luck;
        this.equipment = new Equipment(weapon, armor, accessory);
        this.condition = "正常";
        this.inventory = [];
    }
    
    attack() {
        var damage = Math.floor(Math.random() * (this.attack - this.enemy_defense + 1)) + this.luck;
        if (damage < 1) {
        damage = 1;
        }
        console.log(`${this.name}の攻撃！${damage}のダメージを与えた。`);
    }
    
    defend() {
        console.log(`${this.name}は防御態勢をとった。`);
    }
    
    use_item(item) {
        if (item.effect == "回復") {
        // 回復アイテムを使用した場合の処理
        this.hp += item.value;
        if (this.hp > this.max_hp) {
            this.hp = this.max_hp;
        }
        console.log(`${item.name}を使い、体力を${item.value}回復した。現在の体力は${this.hp}だ。`);
        } else if (item.effect == "異常回復") {
        // 異常回復アイテムを使用した場合の処理
        if (this.condition == "正常") {
            console.log(`${item.name}を使ったが、何も起こらなかった。`);
        } else {
            this.condition = "正常";
            console.log(`${item.name}を使い、${this.name}の状態異常が解除された。現在の状態は${this.condition}だ。`);
        }
        } else if (item.effect == "異常付与") {
        // 異常付与アイテムを使用した場合の処理
        this.enemy_condition = "混乱";
        console.log(`${item.name}を使い、相手を混乱させた。相手の状態は${this.enemy_condition}だ。`);
        } else if (item.effect == "戦闘用") {
        // 戦闘用アイテムを使用した場合の処理
        var damage = item.value;
        this.enemy_hp -= damage;
        console.log(`${item.name}を使い、相手に${damage}のダメージを与えた。相手の残りの体力は${this.enemy_hp}だ。`);
        }
    }

    cast_spell(){

    }
}
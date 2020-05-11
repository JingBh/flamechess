const remove = require("lodash/remove");

export type Available = Array<[number, number]>;

function add(available: Available, x1: number, x2: number, y1: number, y2: number) {
    for (let x: number = x1; x < x2; x ++) {
        for (let y: number = y1; y < y2; y ++) {
            available.push([x, y]);
        }
    }
}

function minus(available: Available, x1: number, x2: number, y1: number, y2: number) {
    for (let x: number = x1; x < x2; x ++) {
        for (let y: number = y1; y < y2; y ++) {
            remove(available, function(item: [number, number]) {
                return item[0] === x && item[1] === y;
            });
        }
    }
}

export function getAvailable(boardrects: string, x: number, y: number): Available {
    if (boardrects.indexOf(";") !== -1) return getAvailableOld(boardrects);

    let available: Available = [];

    let xi: number = 0;
    let yi: number = 0;

    for (let i = 0; i < boardrects.length; i ++) {
        let char = boardrects[i];
        if (char === "0") available.push([xi, yi]);

        xi ++;
        if (xi >= y) {
            yi ++;
            xi = 0;
        }
    }

    return available;
}

/**
 * Algorithm by ZHC
 * @see https://github.com/zhc7
 */
export function getAvailableOld(boardrects: string): Available {
    let available: Available = [];

    let orders = boardrects.split(";");
    for (let order of orders) {
        order = order.trim();
        if (order) {
            let suborders = order.split(",");
            if (suborders.length === 5) {
                let method = suborders[0];
                let x1: number = Number(suborders[1]);
                let x2: number = Number(suborders[2]);
                let y1: number = Number(suborders[3]);
                let y2: number = Number(suborders[4]);

                if (method === "+") {
                    add(available, x1, x2, y1, y2);
                } else if (method === "-") {
                    minus(available, x1, x2, y1, y2);
                }
            }
        }
    }

    return available;
}

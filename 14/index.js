const fs = require('fs')

const main = () => {
    let data = fs.readFileSync('./input.txt', encoding='utf-8', () => { console.log("Error trying to read the file.") } ).split('\n')
    
    const linebreak = data.findIndex(line => line === '');

    let polymer = data.slice(0, linebreak).join('');
    let rulebook = getRulebook(data.slice(linebreak + 1));
    
    // P1
    solve(polymer, rulebook, 10)

    // P2
    solve(polymer, rulebook, 40)
};

const solve = (polymer, rulebook, n) => {
    let lastPair = polymer.slice(-2);
    let pairs = {};

    for(const pair of getPairs(polymer)) {
        if(!pairs.hasOwnProperty(pair)) {
            pairs[pair] = 0;
        }
        pairs[pair] += 1;
    };

    for(let i = 0; i < n; i++) {
        pairs = step(pairs, rulebook)
        lastPair = rulebook[lastPair][1]
    }

    let elementTallies = tallyElements(pairs);

    elementTallies[lastPair[1]]++

    const min = Math.min(...Object.values(elementTallies))
    const max = Math.max(...Object.values(elementTallies))

    console.log(`Most frequent element count: ${max}`)
    console.log(`Least frequent element count: ${min}`)
    console.log(`Diff: ${max - min}`)
}

const tallyElements = (pairs) => {
    let tally = {};

    for (const pair of Object.keys(pairs)) {
        const element = pair[0]
        if(!tally.hasOwnProperty(element)) {
            tally[element] = 0;
        }

        tally[element] += pairs[pair];
    }

    return tally;
}

const getRulebook = (rules) => {
    let rulebook = {};

    rules.forEach(rule => {
        const [pair, element] = rule.split(' -> ')
        rulebook[pair] = [pair[0] + element, element + pair[1]]
    });

    return rulebook
}

const step = (previousPairs, rulebook) => {
    let nextPairs = {};

    for(const pair of Object.keys(previousPairs)) {
        const newPairs = rulebook[pair];
        newPairs.forEach(newPair => {
            if(!nextPairs.hasOwnProperty(newPair)) {
                nextPairs[newPair] = 0;
            }
            nextPairs[newPair] += previousPairs[pair];
        })
    }

    return nextPairs
}

const getPairs = (polymer) => {
    let pairs = [];
    for(const [index, element] of polymer.split('').entries()) {
        if(index === 0) {
            continue;
        };
        const pair = `${polymer[index-1]}${element}`;
        pairs.push(pair)
    }

    return pairs;
}

main();
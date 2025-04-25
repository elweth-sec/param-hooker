(function() {
    const originalGet = URLSearchParams.prototype.get;
    const originalHas = URLSearchParams.prototype.has;

    function getCallerInfo() {
        const error = new Error();
        if (!error.stack) return 'no stack available';
    
        const stackLines = error.stack.split('\n').slice(1); // skip "Error"
        for (const line of stackLines) {
            const match = line.match(/at (.+?) \((.+):(\d+):(\d+)\)/);
            if (match) {
                const [, func, file, lineNum, colNum] = match;
                return `${file}:${lineNum}:${colNum} (in ${func})`;
            }
    
            const altMatch = line.match(/at (.+):(\d+):(\d+)/);
            if (altMatch) {
                const [, file, lineNum, colNum] = altMatch;
                return `${file}:${lineNum}:${colNum}`;
            }
        }
    
        return 'unknown location (no match in stack)';
    }

    function parseStack(error) {
        if (!error.stack) return 'no stack';
    
        const lines = error.stack.split('\n').slice(1); // skip "Error"
        for (const line of lines) {
            if (line.includes('inject.js')) continue;
    
            const match = line.match(/at (.+?) \((.+):(\d+):(\d+)\)/);
            if (match) {
                const [, fn, file, lineNum, colNum] = match;
                return `${file}:${lineNum}:${colNum}`;
            }
    
            const alt = line.match(/at (.+):(\d+):(\d+)/);
            if (alt) {
                const [, file, lineNum, colNum] = alt;
                return `${file}:${lineNum}:${colNum}`;
            }
        }
        return 'unknown (only internal stack)';
    }
    
    URLSearchParams.prototype.get = function(name) {
        const err = new Error();
        const value = originalGet.call(this, name);
        const callerInfo = parseStack(err);
        console.log(`\u2705 URLSearchParams.get('${name}') => ${value} at ${callerInfo}`);
        return value;
    };

    URLSearchParams.prototype.has = function(name) {
        const err = new Error();
        const value = originalHas.call(this, name);
        const callerInfo = parseStack(err);
        console.log(`\u2705 URLSearchParams.get('${name}') => ${value} at ${callerInfo}`);
        return value;
    };
    console.log('[ParamHooker] URLSearchParams methods hooked successfully!');
})();
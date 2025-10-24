class BoltExpression {
    static evaluate(expression, data) {
        let tokens = BoltTokenizer.tokenize(expression);
        let parser = new BoltParser(tokens);
        let ast = parser.parse();
        return evaluate(ast, data);
    }

    static getExpressionMembers(expression) {
        let tokens = BoltTokenizer.tokenize(expression);
        let parser = new BoltParser(tokens);
        let ast = parser.parse();
        return this.collectBaseIdentifiers(ast);
    }

    static collectBaseIdentifiers(ast) {
        const bases = [];

        (function visit(node, parent) {
            if (!node || typeof node !== "object") return;

            if (node.type === "Identifier") {
                const isObjectInMember =
                    parent && parent.type === "MemberExpression" && parent.object === node;
                const isPropertyInMember =
                    parent && parent.type === "MemberExpression" && parent.property === node;

                // bierzemy tylko identyfikatory NIEbędące obiektem w MemberExpression
                if (!isObjectInMember) {
                    // np. "age", "stop"
                    bases.push(node.name);
                }
            }

            for (const key in node) {
                const val = node[key];
                if (val && typeof val === "object") visit(val, node);
            }
        })(ast, null);

        return [...new Set(bases)];
    }
}

class BoltTokenizer {
    static tokenize(input) {
        const regex = /\s*([A-Za-z_]\w*|\d+|'[^']*'|"[^"]*"|==|!=|>=|<=|&&|\|\||[=><().])\s*/g;
        let tokens = [];
        let m;
        while ((m = regex.exec(input)) !== null) {
            tokens.push(m[1]);
        }
        return tokens;
    }
}

class BoltParser {
    i = 0;
    tokens = [];

    constructor(tokens) {
       this.tokens = tokens;

    }

    peek() { return this.tokens[this.i]; }
    consume() { return this.tokens[this.i++]; }

    parse() {
        return this.parseExpression();
    }

    parseExpression() {
        return this.parseOr();
    }

    parseOr() {
        let node = this.parseAnd();
        while (this.peek() === "||") {
            let op = this.consume();
            let right = this.parseAnd();
            node = { type: "LogicalExpression", operator: op, left: node, right };
        }
        return node;
    }

    parseAnd() {
        let node = this.parseComparison();
        while (this.peek() === "&&") {
            let op = this.consume();
            let right = this.parseComparison();
            node = { type: "LogicalExpression", operator: op, left: node, right };
        }
        return node;
    }

    parseComparison() {
        let node = this.parseMember();
        while (["==", "!=", ">", "<", ">=", "<=", "="].includes(this.peek())) {
            let op = this.consume();
            let right = this.parseMember();
            node = { type: "BinaryExpression", operator: op, left: node, right };
        }
        return node;
    }

    parseMember() {
        let node = this.parsePrimary();
        while (this.peek() === ".") {
            this.consume(); // "."
            let prop = this.consume();
            node = {
                type: "MemberExpression",
                object: node,
                property: { type: "Identifier", name: prop }
            };
        }
        return node;
    }

    parsePrimary() {
        let t = this.consume();

        if (t === "(") {
            let node = this.parseExpression();
            if (this.peek() !== ")") throw new Error("Missing closing parenthesis");
            this.consume(); // ")"
            return node;
        }

        if (/^\d+$/.test(t)) return { type: "Literal", value: Number(t) };
        if (/^'.*'$|^".*"$/.test(t)) return { type: "Literal", value: t.slice(1, -1) };
        if (t === "true") return { type: "Literal", value: true };
        if (t === "false") return { type: "Literal", value: false };
        return { type: "Identifier", name: t };
    }
}

function evaluate(node, context) {
    switch (node.type) {
        case "Literal": return node.value;
        case "Identifier": return context[node.name];
        case "MemberExpression": {
            let obj = evaluate(node.object, context);
            return obj?.[node.property.name];
        }
        case "BinaryExpression": {
            let left = evaluate(node.left, context);
            let right = evaluate(node.right, context);
            switch (node.operator) {
                case "==": return left == right;
                case "!=": return left != right;
                case ">": return left > right;
                case "<": return left < right;
                case ">=": return left >= right;
                case "<=": return left <= right;
                case "=": {
                    if (node.left.type === "MemberExpression") {
                        let obj = evaluate(node.left.object, context);
                        obj[node.left.property.name] = right;
                        return right;
                    }
                    throw new Error("Invalid assignment");
                }
            }
        }
        case "LogicalExpression": {
            if (node.operator === "&&") return evaluate(node.left, context) && evaluate(node.right, context);
            if (node.operator === "||") return evaluate(node.left, context) || evaluate(node.right, context);
        }
    }
}
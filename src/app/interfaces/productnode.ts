export interface Productnode {
    name: string;
    children?: Productnode[]; // Usando a recursividade para representar filhos que têm a mesma estrutura
    value?: number;
}

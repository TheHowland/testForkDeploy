from lcapy import Circuit
from lcapy import Solution
from lcapy import FileToImpedance

# cct = Circuit(FileToImpedance("Circuits/Circuit_mixed.txt"))
# cct = Circuit(filename="Circuits/Circuit_resistors.txt")
# cct = Circuit(filename="Circuits/Circuit_capacitors.txt")
# cct = Circuit(filename="Circuits/Circuit_inductors.txt")

def solve_circuit(filename: str, filePath = "Circuits/"):
    cct = Circuit(FileToImpedance(filePath+filename))
    steps = cct.simplify_stepwise()
    sol = Solution(steps)
    sol.draw(path="Solutions")
    sol.export(path="Solutions")

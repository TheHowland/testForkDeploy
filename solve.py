from lcapy import Circuit, Solution, FileToImpedance, DrawWithSchemdraw
import os

def solve_circuit(filename: str, filePath="Circuits/"):
    cct = Circuit(FileToImpedance(filePath+filename))
    steps = cct.simplify_stepwise()
    sol = Solution(steps)
    sol.draw(path="Solutions")
    sol.export(path="Solutions")


class SolveInUserOrder:
    def __init__(self, filename: str, filePath=None, savePath=None):
        """
        :param filename: str with filename of circuit to simplify
        :param filePath: str with path to circuit file if not in current directory
        :param savePath: str with path to save the result svg and jason files to
        """
        if filePath is None:
            filePath = ""
        if savePath is None:
            savePath = ""

        self.filename = filename
        self.filePath = filePath
        self.savePath = savePath
        self.circuit = Circuit(FileToImpedance(os.path.join(filePath, filename)))
        self.steps = [(self.circuit, None, None, None, None)]

        return

    def simplifyTwoCpts(self, cpts: list) -> tuple[bool, str, str]:
        """
        :param cpts: list with two component name strings to simplify ["R1", "R2"]
        :return tuple with bool if simplification is possible, str with json filename, str with svg filename
        """
        if cpts[1] in self.circuit.in_series(cpts[0]):
            newNet, newCptName = self.circuit.simplify_two_cpts(self.circuit, cpts)
            self.steps.append((newNet, cpts[0], cpts[1], newCptName, "series"))
        elif cpts[1] in self.circuit.in_parallel(cpts[0]):
            newNet, newCptName = self.circuit.simplify_two_cpts(self.circuit, cpts)
            self.steps.append((newNet, cpts[0], cpts[1], newCptName, "parallel"))
        else:
            return False, "", ""

        sol = Solution(self.steps)
        newestStep = sol.available_steps[-1]

        jsonName = sol.exportStepAsJson(newestStep, path=self.savePath, filename=os.path.splitext(self.filename)[0])
        svgName = sol.drawStep(newestStep, path=self.savePath, filename=os.path.splitext(self.filename)[0])

        self.circuit = newNet
        return True, jsonName, svgName

    def createInitialStep(self) -> tuple[bool, str, str]:
        """
        create the initial step or step0 of the circuit
        :return tuple with bool if simplification is possible, str with json filename, str with svg filename
        """
        nameStep0Svg = f"{os.path.splitext(filename)[0]}_step0.svg"
        nameStep0Json = self.filename

        sol = Solution(self.steps)
        nameStep0Json = sol.exportStepAsJson("step0", path=self.savePath, filename=nameStep0Json)
        nameStep0Svg = DrawWithSchemdraw(sol["step0"].circuit, fileName=nameStep0Svg).draw(path=self.savePath)

        return True, nameStep0Json, nameStep0Svg

    def createStep0(self) -> tuple[bool, str, str]:
        return self.createInitialStep()

    def getSolution(self):
        return Solution(self.steps)


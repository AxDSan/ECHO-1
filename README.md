# ECHO
Official homepage for "s**E**lf-Harmonized **C**hain of t**HO**ught"

[_UPDATE_ **Sept-16-2024** : We update the code to fit to the lastest OPENAI version, as requested by issue. We also share the log and demo to save your effort.]

[_UPDATE_ Feb-16-2024 : First Submission.]

This is the official implementation of `Self-Harmonized Chain of Thought`.

The paper is available at https://www.arxiv.org/abs/2409.04057 .

This repo is built upon Auto-CoT repo. A BIG THANKS.

<!-- <div align="center">
<img src="intro.jpg">
</div> -->

## Installation

Setup the environment from requirements.txt: 
```
pip install -r requirements.txt
```

## Get Started

Set your API:

```
export OPENAI_API_KEY=(YOUR OPENAI API KEY)
```

Similarly, you should set MISTRAL_API_KEY if you want to use the MISTRAL models.

### Step to reproduce main experiment results

(Optional) **Step 0: Log Creation** 

We have created the log for you using Zero-Shot CoT. This serves as an initialization of our method. If you are using other models, you may consider running this.

Note that this is not compulsory, as the demo selection will only depend on the question, not the rationale. You can skip this step and directly regenerate the rationale using your model.
```
source run/crate_log.sh
```

**Step 1: DEMO creation** 

We follow Auto-CoT to use the clustering, and then select one question from each cluster.
As k=max requires maximum number of demonstration allowed by context length, we generate a number of 8 to 32 demonstrations for each dataset. If you are not running k=max case, you can generate only 8 demonstrations.

```
source run/create_demos.sh
```

**Step 2: RUN ECHO~!**

Now you can run ECHO with
```
source run/run_echo.sh
```

This script contains two step: run_ECHO.py creates the demo with ECHO, and run_inference.py will use the demo generated by them.

**Step 3: RUN ECHO (k=max)**

```
source run_echo_max.sh
```

**Step 4: run inference**

We attached the inference code after run_echo.sh and run_echo_max.sh
If you want to test Auto-CoT, please use the demo: 
```
demos/{dataset}_{model_name}
```
If you want to test manual prompt (from Few-shot-CoT), please use the demo: 
```
demos/{dataset}_manual
```
We suggest **T=4** for optimal performance. However, we found that an easier and less diverse dataset may require less iteration.

You can replace "singleeq" to any other datasets we included: "aqua", "gsm8k", "commonsensqa", "addsub", "multiarith",  "strategyqa", "svamp", "singleeq", "coin_flip", "last_letters"

We also include the code for inferencing Mistral API.

If you have any question, please consider raise an issue or directly email Ziqi.

## Citation

To cite our paper, please include the following bibtex:

```
@misc{jin2024selfharmonizedchainthought,
      title={Self-Harmonized Chain of Thought}, 
      author={Ziqi Jin and Wei Lu},
      year={2024},
      eprint={2409.04057},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2409.04057}, 
}
```

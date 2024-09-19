@echo off
setlocal enabledelayedexpansion

# Define the array of dataset names
set dataset_names=multiarith gsm8k singleeq addsub aqua svamp commonsensqa strategyqa last_letters coin_flip
set model_name=gpt-3.5-turbo-0301

# Loop over dataset names
for %%d in (%dataset_names%) do (
    # Loop over cluster numbers from 8 to 32
    for /l %%n in (8,1,32) do (
        python run_demo.py ^
            --task %%d ^
            --pred_file log/%%d_%model_name%_zero_shot_cot.log ^
            --demo_save_dir demos/%%d_%model_name%_%%n ^
            --num_clusters %%n
    )
)

endlocal